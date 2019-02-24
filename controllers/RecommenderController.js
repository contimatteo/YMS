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

var GenresController = require('./GenresController.js')

const Op = Sequelize.Op;
const youtubeApi = new YoutubeApi()
var youtubeRelated = new YoutubeRelatedClass()
var AjaxRequest = new AjaxRequestClass()

var otherGroupsLinks = require("../json/otherGroupsLinks.json")

let API_RELATIVE_QUEUE_PARSING_INTERVAL = 2500
let API_RELATIVE_QUEUE = {
  urlsVisited: [],
  previousVideosLength: 0,
  videos: [],
  videosDownloaded: [],
  interval: null,
  endProcessing: true,
  returnedReponse: true,
  firstTime: true
}

let API_ABSOLUTE_QUEUE_PARSING_INTERVAL = 1000
let API_ABSOLUTE_QUEUE = {
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

  random(response) {
    return new Promise(function (resolve, reject) {
      ORMHelper.getVideoRandom().then(function (videoObject) {
        var formattedVideoId = DataHelper.getFirstCharacterFromId(videoObject)
        // console.log(formattedVideoId)
        youtubeApi.search(formattedVideoId, constants.recommenderVideosNumber, null, null).then(function (videosRandom) {
          resolve(videosRandom)
        }).catch(function (error) {
          //console.log(error)
          reject(error)
        })
      }).catch(function (error) {
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
      VideosController.getVideoById(videoId).then(function (videoRecord) {
        if (videoRecord && videoRecord.Genre && videoRecord.Genre.name) {
          const genre = videoRecord.Genre.name
          GenresController.getAndSearchSongsByVideo(videoRecord).then((videosData) => {
            resolve(videosData)
          }).catch((error) => {
            console.log("354 Recommender Controller ", error)
          })
        } else {
          reject({})
        }
      }).catch((error) => {
        console.log("360 Recommender Controller ", error)
      })
    })
  },



  _absoluteQueueRequestCycle() {
    // console.log("numero di url visitati", API_ABSOLUTE_QUEUE.urlsVisited.length, " ---- numero url totali", otherGroupsLinks.urls.length)
    if (API_ABSOLUTE_QUEUE.urlsVisited.length >= otherGroupsLinks.urls.length) {
      API_ABSOLUTE_QUEUE.endProcessing = true

      API_ABSOLUTE_QUEUE.videos = []
      API_ABSOLUTE_QUEUE.previousVideosLength = 0
      API_ABSOLUTE_QUEUE.urlsVisited = []

      clearInterval(API_ABSOLUTE_QUEUE.interval)
      API_ABSOLUTE_QUEUE.interval = null

      // console.log("queue parsing end")
      // console.log(API_ABSOLUTE_QUEUE.endProcessing)
      // console.log("")
      // console.log("")
      // console.log("")
    }

    return
  },

  _addVideoToAbsoluteQueue(url) {
    AjaxRequest.jsonRequest(url, 'GET', {})
      .then(videosData => {
        API_ABSOLUTE_QUEUE.urlsVisited.push(url)
        API_ABSOLUTE_QUEUE.previousVideosLength = API_ABSOLUTE_QUEUE.videos.length

        if (videosData.recommended) {
          videosData.recommended.forEach((video) => {
            API_ABSOLUTE_QUEUE.videos.push(video)
            API_ABSOLUTE_QUEUE.videosDownloaded = API_ABSOLUTE_QUEUE.videos
          })
        }

        // console.log("stato attuale ", API_ABSOLUTE_QUEUE.urlsVisited.length, otherGroupsLinks.urls.length)
      })
      .catch(error => {
        API_ABSOLUTE_QUEUE.urlsVisited.push(url)
        // console.log(url, "errore", error)
      })
  },

  globalAbsolutePopularity() {
    var promises = []
    var videoPromises = []
    let currentLinkIndex = 0
    let videoFromOtherGroups = []

    // console.log("should i start the interval -->", API_ABSOLUTE_QUEUE.interval===null && API_ABSOLUTE_QUEUE.videos.length === 0 && API_ABSOLUTE_QUEUE.videosDownloaded.length === 0 && API_ABSOLUTE_QUEUE.endProcessing)
    if (API_ABSOLUTE_QUEUE.interval === null && API_ABSOLUTE_QUEUE.videos.length === 0 && API_ABSOLUTE_QUEUE.videosDownloaded.length === 0 && API_ABSOLUTE_QUEUE.endProcessing) {

      if (API_ABSOLUTE_QUEUE.firstTime)
        API_ABSOLUTE_QUEUE.firstTime = false

      // console.log("INTERVAL START")
      API_ABSOLUTE_QUEUE.interval = API_ABSOLUTE_QUEUE.interval || setInterval(_ => self._absoluteQueueRequestCycle(), API_ABSOLUTE_QUEUE_PARSING_INTERVAL)

      for (const url of otherGroupsLinks.urls) {
        videoPromises.push(self._addVideoToAbsoluteQueue(url))
        currentLinkIndex++
      }

      Promise.all(videoPromises).catch(error => {})
    }

    return new Promise((resolve, reject) => {
      let promise = []
      const videoResults = RecommenderHelper.globalAbsolutePopularity(API_ABSOLUTE_QUEUE.videosDownloaded)

      // foreach video calculated
      videoResults.forEach(video => {
        promises.push(VideosController.getVideoInfoFromYoutubeApi(null, video.id))
      })
      Promise.all(promises)
        .then(videosData => {
          const videosDownloadedLength = API_ABSOLUTE_QUEUE.videosDownloaded.length

          if (API_ABSOLUTE_QUEUE.endProcessing)
            API_ABSOLUTE_QUEUE.videosDownloaded = []

          const end = API_ABSOLUTE_QUEUE.endProcessing && videosDownloadedLength > 0 && API_ABSOLUTE_QUEUE.videos.length === 0

          // console.log("numero di risultati ritornati ", videosData.length, " ------ lunghezza video scaricati parziali ", videosDownloadedLength)
          // console.log("************** ho finito ?", end, "**************")
          // if (end) {
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          // }

          resolve({
            videosData,
            end
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

  _relativeQueueRequestCycle() {
    // console.log("numero di url visitati", API_RELATIVE_QUEUE.urlsVisited.length, " ---- numero url totali", otherGroupsLinks.urls.length)

    if (API_RELATIVE_QUEUE.urlsVisited.length >= otherGroupsLinks.urls.length) {

      // console.log("queue parsing end")

      API_RELATIVE_QUEUE.endProcessing = true
      API_RELATIVE_QUEUE.videos = []
      API_RELATIVE_QUEUE.previousVideosLength = 0
      API_RELATIVE_QUEUE.urlsVisited = []

      clearInterval(API_RELATIVE_QUEUE.interval)
      API_RELATIVE_QUEUE.interval = null
    }

    return
  },

  _addVideoToRelativeQueue(url) {
    AjaxRequest.jsonRequest(url, 'GET', {})
      .then(videosData => {
        // console.log("")
        // console.log("url caricato correttamente ", url)
        API_RELATIVE_QUEUE.urlsVisited.push(url)
        API_RELATIVE_QUEUE.previousVideosLength = API_RELATIVE_QUEUE.videos.length

        if (videosData.recommended) {
          videosData.recommended.forEach((video) => {
            API_RELATIVE_QUEUE.videos.push(video)
            API_RELATIVE_QUEUE.videosDownloaded = API_RELATIVE_QUEUE.videos
          })
        }

        // console.log("stato attuale ", API_RELATIVE_QUEUE.urlsVisited.length, otherGroupsLinks.urls.length)
      })
      .catch(error => {
        API_RELATIVE_QUEUE.urlsVisited.push(url)
        // console.log("url caricato in modo errato ", url)
        // console.log(url, "errore", error)
      })
  },

  globalRelativePopularity(videoId) {
    var promises = []
    var videoPromises = []
    let currentLinkIndex = 0
    let videoFromOtherGroups = []

    // console.log("should i start the interval -->", API_RELATIVE_QUEUE.interval===null && API_RELATIVE_QUEUE.videos.length === 0 && API_RELATIVE_QUEUE.videosDownloaded.length === 0 && API_RELATIVE_QUEUE.endProcessing)
    if (API_RELATIVE_QUEUE.interval === null && API_RELATIVE_QUEUE.videos.length === 0 && API_RELATIVE_QUEUE.videosDownloaded.length === 0 && API_RELATIVE_QUEUE.endProcessing) {

      if (API_RELATIVE_QUEUE.firstTime)
        API_RELATIVE_QUEUE.firstTime = false

      // console.log("INTERVAL START")
      API_RELATIVE_QUEUE.interval = API_RELATIVE_QUEUE.interval || setInterval(_ => self._relativeQueueRequestCycle(), API_RELATIVE_QUEUE_PARSING_INTERVAL)

      for (const url of otherGroupsLinks.urls) {
        videoPromises.push(self._addVideoToRelativeQueue(url + "?id=" + videoId))
        currentLinkIndex++
      }

      Promise.all(videoPromises).catch(error => {})
    }

    return new Promise((resolve, reject) => {
      let promise = []
      const videoResults = RecommenderHelper.globalRelativePopularity(API_RELATIVE_QUEUE.videosDownloaded)

      // foreach video calculated
      videoResults.forEach(video => {
        promises.push(VideosController.getVideoInfoFromYoutubeApi(null, video.id))
      })
      Promise.all(promises)
        .then(videosData => {
          const videosDownloadedLength = API_RELATIVE_QUEUE.videosDownloaded.length

          if (API_RELATIVE_QUEUE.endProcessing)
            API_RELATIVE_QUEUE.videosDownloaded = []

          const end = API_RELATIVE_QUEUE.endProcessing && videosDownloadedLength > 0 && API_RELATIVE_QUEUE.videos.length === 0

          // console.log("numero di risultati ritornati ", videosData.length, " ------ lunghezza video scaricati parziali ", videosDownloadedLength)
          // console.log("************** ho finito ?", end, "**************")
          // if (end) {
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          //   console.log("")
          // }

          resolve({
            videosData,
            end
          })
        })
        .catch(error => {
          resolve({
            videosData: [],
            end
          })
        })
    })
  }
}

const VideosController = require('./VideosController.js')
const ArtistsController = require('./ArtistsController.js')