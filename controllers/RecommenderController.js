const Sequelize = require('sequelize')

var AjaxRequestClass = require('../libraries/AjaxRequest.js')
var YoutubeRelatedClass = require('../libraries/YoutubeApi.js')

var YoutubeApi = require('../libraries/YoutubeApi.js')
var constants = require('./helpers/ConstantsHelper.js')
var RecommenderHelper = require('./helpers/RecommenderHelper.js')
var ORMHelper = require('./helpers/ORMHelper.js')
var DataHelper = require('./helpers/DataHelper.js')

var ViewsHistory = require("../models/ViewsHistory.js")
var User = require("../models/User.js")
var Video = require("../models/Video.js")
var Artist = require("../models/Artist.js")
var Channel = require("../models/Channel.js")
var Genre = require("../models/Genre.js")

const Op = Sequelize.Op;
const youtubeApi = new YoutubeApi()
var youtubeRelated = new YoutubeRelatedClass()
var AjaxRequest = new AjaxRequestClass()

var otherGroupsLinks = require("../json/otherGroupsLinks.json")

let API_RELATIVE_QUEUE_PARSING_INTERVAL = 3000
let API_RELATIVE_QUEUE = {
  urlsVisited: [],
  previousVideosLength: 0,
  videos: [],
  videosDownloaded: [{}],
  interval: null,
  end: false
}

let API_ASSOLUTE_QUEUE_PARSING_INTERVAL = 3000
let API_ASSOLUTE_QUEUE = {
  urlsVisited: [],
  previousVideosLength: 0,
  videos: [],
  videosDownloaded: [],
  interval: null,
  endProcessing: true,
  returnedReponse: true,
  firstTime: true
}


var self = module.exports = {
  // fvitali get request
  vitali(id) {
    return new Promise((resolve, reject) => {
      var url = "http://site1825.tw.cs.unibo.it/TW/globpop?id=" + id;
      AjaxRequest.jsonRequest(url, 'GET', {}).then(function (vitaliResponse) {
        var promises = [];
        vitaliResponse.recommended.forEach(video => {
          promises.push(VideosController.getVideoInfoFromYoutubeApi(null, video.videoID))
        })
        Promise.all(promises)
          .then(videosData => {
            resolve(videosData)
          })
          .catch(error => {
            resolve(null)
          })
      }).catch((error) => {
        resolve(null)
      })
    })
  },

  localRelativePopularity(response, videoId) {
    return new Promise((resolve, reject) => {
      ViewsHistory.findAll({
        // INFO: no filters on user id
        order: [
          ['id', 'ASC']
        ],
      }).then(results => {
        var promises = [];
        var videoFounded = RecommenderHelper.localRelativePopularityCounter(results, videoId)
        videoFounded.forEach(video => {
          promises.push(VideosController.getVideoById(video.videoId))
        })
        Promise.all(promises)
          .then(videosData => {
            resolve(videosData)
          })
          .catch(error => {
            reject(error)
          })
      }).catch((error) => {
        reject(error)
      })
    })
  },
  
  random(response){
    return new Promise (function(resolve,reject){
      ORMHelper.getVideoRandom().then(function(videoObject){
      var formattedVideoId = DataHelper.getFirstCharacterFromId(videoObject)
      // console.log(formattedVideoId)
       youtubeApi.search(formattedVideoId, constants.recommenderVideosNumber, null, null).then(function(videosRandom){
        resolve(videosRandom)
       }).catch(function(error){
         //console.log(error)
          reject(error)
       })
      }).catch(function(error){
          // console.log(error)
          reject([]) 
      })
    })
  },

  recent(response, userId) {
    return new Promise((resolve, reject) => {
      Video.findAll({
        include: [{
            model: User,
            where: {
              id: userId
            }
          },
          {
            model: Channel
          }
        ],
        limit: constants.recommenderVideosNumber,
        order: [
          ['updatedAt', 'DESC']
        ],
        group: ['youtube_id']
      }).then(function (videoRecent) {
        resolve(videoRecent)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  localAbsolutePopularity(response) {
    return new Promise((resolve, reject) => {
      Video.findAll({
        include: [
          Artist, Channel
        ],
        order: [
          ['views', 'DESC']
        ],
        limit: constants.recommenderVideosNumber
      }).then(function (videoFound) {
        resolve(videoFound)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  related(response, id) {
    return new Promise((resolve, reject) => {
      youtubeRelated.getVideoRelatedById(id, constants.recommenderVideosNumber).then(function (results) {
        resolve(results)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  artistSimilarity(res, videoId) {
    return new Promise((resolve, reject) => {
      return VideosController.getVideoById(videoId).then(function (videoFounded) {
        if (videoFounded != null) {
          var promises = [];
          videoFounded.Artists.forEach(function (artist, index) {
            promises.push(ArtistsController.getRelatedArtistsById(artist.id))
          })
          Promise.all(promises)
            .then(artistsFounded => {
              var calculateArtistsAndVideosNumbers = RecommenderHelper.artistSimilarity(artistsFounded)
              var artistsRelatedNames = calculateArtistsAndVideosNumbers.artistsNames;
              var artistsVideosNumbers = calculateArtistsAndVideosNumbers.artistsVideosNumbers;
              var promises2 = [];
              for (var i = 0; i < artistsRelatedNames.length; i++) {
                // search video for this artist
                promises2.push(youtubeApi.search(artistsRelatedNames[i], artistsVideosNumbers[i], null))
              }
              Promise.all(promises2)
                .then(videosData => {
                  var finalVideosResults = [];
                  videosData.forEach(function (videosObject, index) {
                    videosObject.items.forEach(function (singleVideoObject, index) {
                      finalVideosResults.push(singleVideoObject)
                    })
                  })
                  resolve(finalVideosResults)
                })
                .catch(error => {
                  reject(error)
                })
            })
            .catch(error => {
              reject(error)
            })
        } else {
          // no artist founded for this video
          reject({
            "status": "error",
            "message": "no artists founded for this video"
          })
        }
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  bandMembersSimilarity(res, videoId) {
    return new Promise((resolve, reject) => {
      VideosController.getVideoById(videoId).then(function (videoFounded) {
        if (videoFounded != null) {
          var promises = [];
          videoFounded.Artists.forEach(function (artist, index) {
            if (artist.type == "band") {
              promises.push(ArtistsController.getBandsMembersById(artist.id))
            } else {
              reject({
                "status": "error",
                "message": "this artist isn't a band"
              })
            }
          })
          Promise.all(promises)
            .then(artistsFounded => {
              var calculateArtistsAndVideosNumbers = RecommenderHelper.bandMembersSimilarity(artistsFounded)
              var artistsRelatedNames = calculateArtistsAndVideosNumbers.artistsNames;
              var artistsVideosNumbers = calculateArtistsAndVideosNumbers.artistsVideosNumbers;
              var promises2 = [];
              for (var i = 0; i < artistsRelatedNames.length; i++) {
                // search video for this artist
                promises2.push(youtubeApi.search(artistsRelatedNames[i], artistsVideosNumbers[i], null))
              }
              Promise.all(promises2)
                .then(videosData => {
                  var finalVideosResults = [];
                  videosData.forEach(function (videosObject, index) {
                    videosObject.items.forEach(function (singleVideoObject, index) {
                      finalVideosResults.push(singleVideoObject)
                    })
                  })
                  resolve(finalVideosResults)
                })
                .catch(error => {
                  reject(error)
                })
            })
            .catch(error => {
              reject(error)
            })
        } else {
          // no artist founded for this video
          reject({
            "status": "error",
            "message": "no artists founded for this video"
          })
        }
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  genreSimilarity(response, videoId) {
    return new Promise((resolve, reject) => {
      VideosController.getVideoById(videoId).then(function (videoFounded) {
        Video.findAll({
          include: [{
              model: Channel
            },
            {
              model: Artist
            },
            {
              model: Genre,
              where: {
                id: videoFounded.Genre.id
              }
            }
          ],
          where: {
            id: {
              [Op.not]: videoId // exclude current video
            }
          },
          order: Sequelize.literal('rand()'),
          limit: constants.recommenderVideosNumber
        }).then(function (videosWithThisGenre) {
          if (videosWithThisGenre.length < 20) {
            var idArtistsList = [];
            videoFounded.Artists.forEach((artist) => {
              idArtistsList.push(artist.id)
            })
            return Video.findAll({
              include: [{
                  model: Channel
                },
                {
                  model: Artist,
                  where: {
                    id: idArtistsList
                  }
                }
              ],
              where: {
                id: {
                  [Op.not]: videoId // exclude current video
                }
              },
              order: Sequelize.literal('rand()'),
              limit: (constants.recommenderVideosNumber - videosWithThisGenre.length)
            }).then(function (additionalVideos) {
              additionalVideos.forEach((additionalVideo) => {
                videosWithThisGenre.push(additionalVideo)
              })
              resolve(videosWithThisGenre)
            }).catch(function (error) {
              reject(error)
            })
          } else {
            resolve(videosWithThisGenre)
          }
        }).catch(function (error) {
          reject(error)
        })
      }).catch(function (error) {
        reject(error)
      })
    })
  },


  _assoluteQueueRequestCycle() {
    // console.log("numero di url visitati", API_ASSOLUTE_QUEUE.urlsVisited.length, " ---- numero url totali", otherGroupsLinks.urls.length)
    if (API_ASSOLUTE_QUEUE.urlsVisited.length >= otherGroupsLinks.urls.length) {
      API_ASSOLUTE_QUEUE.endProcessing = true
    }

    if (!!API_ASSOLUTE_QUEUE.endProcessing) {
      API_ASSOLUTE_QUEUE.videos = []
      API_ASSOLUTE_QUEUE.previousVideosLength = 0
      API_ASSOLUTE_QUEUE.urlsVisited = []

      clearInterval(API_ASSOLUTE_QUEUE.interval)
      API_ASSOLUTE_QUEUE.interval = null

      // console.log("queue parsing end")
      // console.log(API_ASSOLUTE_QUEUE.endProcessing)
      // console.log("")
      // console.log("")
      // console.log("")
    }

    return
  },


  _addVideoTAssoluteQueue(url) {
    AjaxRequest.jsonRequest(url, 'GET', {})
      .then(videosData => {
        API_ASSOLUTE_QUEUE.urlsVisited.push(url)
        API_ASSOLUTE_QUEUE.previousVideosLength = API_ASSOLUTE_QUEUE.videos.length

        if (videosData.recommended) {
          videosData.recommended.forEach((video) => {
            API_ASSOLUTE_QUEUE.videos.push(video)
            API_ASSOLUTE_QUEUE.videosDownloaded = API_ASSOLUTE_QUEUE.videos
          })
        }

        // console.log("stato attuale ", API_ASSOLUTE_QUEUE.urlsVisited.length, otherGroupsLinks.urls.length)
      })
      .catch(error => {
        API_ASSOLUTE_QUEUE.urlsVisited.push(url)
        // console.log(url, "errore", error)
      })
  },


  // globalAbsolutePopularity() {

  //   API_ASSOLUTE_QUEUE.interval = API_ASSOLUTE_QUEUE.interval || setInterval(_ => self._assoluteQueueRequestCycle(), API_ASSOLUTE_QUEUE_PARSING_INTERVAL)

  //   return new Promise((resolve, reject) => {
  //     var promises = []
  //     var videoPromises = []
  //     let currentLinkIndex = 0
  //     let videoFromOtherGroups = []

  //     if (API_ASSOLUTE_QUEUE.videos.length === 0) {

  //       for (const url of otherGroupsLinks.urls) {
  //         videoPromises.push(self._addVideoTAssoluteQueue(url))
  //         currentLinkIndex++
  //       }

  //       Promise.all(videoPromises).catch(error => {})
  //     }

  //     let promise = []

  //     // resolve(API_ASSOLUTE_QUEUE.videosDownloaded)
  //     const videoResults = RecommenderHelper.globalAbsolutePopularity(API_ASSOLUTE_QUEUE.videosDownloaded)
  //     // console.log(videoResults)
  //     // foreach video calculated
  //     videoResults.forEach(video => {
  //       promises.push(VideosController.getVideoInfoFromYoutubeApi(null, video.id))
  //     })
  //     Promise.all(promises)
  //       .then(videosData => {
  //         const end = API_ASSOLUTE_QUEUE.endProcessing
  //         if (!!API_ASSOLUTE_QUEUE.endProcessing)
  //           API_ASSOLUTE_QUEUE.endProcessing = false

  //         API_ASSOLUTE_QUEUE.videosDownloaded = []
  //         resolve({
  //           videosData,
  //           end
  //         })
  //       })
  //       .catch(error => {
  //         const end = API_ASSOLUTE_QUEUE.endProcessing
  //         if (!!API_ASSOLUTE_QUEUE.endProcessing)
  //           API_ASSOLUTE_QUEUE.endProcessing = false

  //         API_ASSOLUTE_QUEUE.videosDownloaded = []
  //         resolve({
  //           videosData: [],
  //           end
  //         })
  //       })
  //   })
  // },

  globalAbsolutePopularity() {
    var promises = []
    var videoPromises = []
    let currentLinkIndex = 0
    let videoFromOtherGroups = []

    // console.log(API_ASSOLUTE_QUEUE.interval===null, API_ASSOLUTE_QUEUE.videos.length === 0, API_ASSOLUTE_QUEUE.videosDownloaded.length === 0, API_ASSOLUTE_QUEUE.endProcessing)
    if (API_ASSOLUTE_QUEUE.interval  === null && API_ASSOLUTE_QUEUE.videos.length === 0 && API_ASSOLUTE_QUEUE.videosDownloaded.length === 0 && API_ASSOLUTE_QUEUE.endProcessing) {

      if (API_ASSOLUTE_QUEUE.firstTime)
        API_ASSOLUTE_QUEUE.firstTime = false

     // console.log("INTERVAL START")
      API_ASSOLUTE_QUEUE.interval = API_ASSOLUTE_QUEUE.interval || setInterval(_ => self._assoluteQueueRequestCycle(), API_ASSOLUTE_QUEUE_PARSING_INTERVAL)

      for (const url of otherGroupsLinks.urls) {
        videoPromises.push(self._addVideoTAssoluteQueue(url))
        currentLinkIndex++
      }

      Promise.all(videoPromises).catch(error => {})
    }

    return new Promise((resolve, reject) => {
      let promise = []
      const videoResults = RecommenderHelper.globalAbsolutePopularity(API_ASSOLUTE_QUEUE.videosDownloaded)

      // foreach video calculated
      videoResults.forEach(video => {
        promises.push(VideosController.getVideoInfoFromYoutubeApi(null, video.id))
      })
      Promise.all(promises)
        .then(videosData => {
          const videosDownloadedLength = API_ASSOLUTE_QUEUE.videosDownloaded.length
          
          if (API_ASSOLUTE_QUEUE.endProcessing)
            API_ASSOLUTE_QUEUE.videosDownloaded = []

          // console.log("************** ho finito ?", API_ASSOLUTE_QUEUE.endProcessing && videosDownloadedLength > 0 && API_ASSOLUTE_QUEUE.videos.length === 0, "**************")

          resolve({
            videosData,
            end: API_ASSOLUTE_QUEUE.endProcessing && videosDownloadedLength > 0 && API_ASSOLUTE_QUEUE.videos.length === 0 // FIXME: @contimatteo
          })
        })
        .catch(error => {
          resolve({
            videosData: [],
            end
          })
        })
    })
  },

  // FIXME: check how i order the video founded (understand if my hitmap logic is correct)
  globalRelativePopularity(videoId) {
    //   return new Promise((resolve, reject) => {
    //     self.localRelativePopularity(null, videoId).then(function (videosFounded) {
    //       return VideosController.getVideoById(videoId).then(function (videoObject) {
    //           var promises = [];
    //           otherGroupsLinks.urls.forEach((url, index) => {
    //             promises.push(AjaxRequest.jsonRequest(url + "?id=" + videoObject.youtube_id, 'GET', {}))
    //           })
    //           Promise.all(promises)
    //             .then(function (groupsVideos) {
    //               var promises2 = [];
    //               var videoResults = RecommenderHelper.globalRelativePopularity(videosFounded, groupsVideos)
    //               // foreach video calculated
    //               videoResults.forEach(video => {
    //                 promises2.push(VideosController.getVideoInfoFromYoutubeApi(null, video.id))
    //               })
    //               Promise.all(promises2)
    //                 .then(videosData => {
    //                   resolve(videosData)
    //                 })
    //                 .catch(error => {
    //                   reject(error)
    //                 })
    //             })
    //             .catch(function (error) {
    //               resolve(null)
    //             })
    //         })
    //         .catch(function (error) {
    //           reject(error)
    //         })
    //     }).catch(function (error) {
    //       reject(error)
    //     })
    //   })
  }
}

const VideosController = require('./VideosController.js')
const ArtistsController = require('./ArtistsController.js')