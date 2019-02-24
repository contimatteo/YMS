const utf8 = require('utf8')

var ChannelsController = require('./ChannelsController.js')
var GenresController = require('./GenresController.js')
var ArtistsController = require('./ArtistsController.js')
var SparqlController = require('./SparqlController.js')

var YoutubeApi = require('../libraries/YoutubeApi.js')

var ORMHelper = require('./helpers/ORMHelper.js')
var DataHelper = require('./helpers/DataHelper.js')

var Artist = require("../models/Artist.js")
var ViewsHistory = require("../models/ViewsHistory.js")
var Video = require("../models/Video.js")
var User = require("../models/User.js")
var Channel = require("../models/Channel.js")
var Genre = require("../models/Genre.js")

var vitaliListaObject = require("../json/suggestioned.json")
var ourSuggestionedList = require("../json/recommendedByUs.json")

const youtubeApi = new YoutubeApi()



var self = module.exports = {

  _findArtistAndSongByString(string) {
    return new Promise(function (resolve, reject) {
      var objectString = {
        artists: [],
        song: string
      };
      if ((string.indexOf("-") > -1)) {
        string = string.trim()
        var splittedString = string.split("-")
        if (splittedString.length < 1) {
          splittedString = string.split(":")
        }
        // split song and artist
        splittedString.forEach(function (element, index) {
          splittedString[index] = element.trim()
          splittedString[index] = splittedString[index].replace(/ *\([^)]*\) */g, "")
          splittedString[index] = splittedString[index].replace(/ *\[[^\]]*\] */g, "")
          splittedString[index] = splittedString[index].replace(/ *\{[^)]*\} */g, "")
          splittedString[index] = splittedString[index].replace(/ *\{[^)]*\} */g, "")
          splittedString[index] = splittedString[index].replace(/Feat./g, 'feat.')
          splittedString[index] = splittedString[index].replace(/Feat/g, 'feat.')
          splittedString[index] = splittedString[index].replace(/Featuring./g, 'feat.')
          splittedString[index] = splittedString[index].replace(/Featuring/g, 'feat.')
          splittedString[index] = splittedString[index].replace(/FEAT/g, 'feat.')
          splittedString[index] = splittedString[index].replace(/Ft./g, 'feat.')
          splittedString[index] = splittedString[index].replace(/Ft/g, 'feat.')
          splittedString[index] = splittedString[index].replace(/ft./g, 'feat.')
          splittedString[index] = splittedString[index].replace(/ft/g, 'feat.')
          splittedString[index] = splittedString[index].replace(/&/g, 'feat.')
          splittedString[index] = splittedString[index].replace(/featuring./g, 'feat.')
          splittedString[index] = splittedString[index].replace(/featuring/g, 'feat.')
          splittedString[index] = splittedString[index].replace(/,/g, 'feat.')
          // splittedString[index] = splittedString[index].replace(/feat./g, '^')
          splittedString[index] = splittedString[index].trim()
        })
        // find case
        if ((splittedString[0].indexOf("feat.") < 0) && (splittedString[1].indexOf("feat.") < 0)) {
          return ArtistsController.getArtistInfo(null, splittedString[0]).then(function (artistObject) {
            if (artistObject == null) {
              return ArtistsController.getArtistInfo(null, splittedString[1]).then(function (artistObject2) {
                if (artistObject2 != null) {
                  // 1° case: "Song - Artist"
                  objectString.song = splittedString[0];
                  objectString.artists.push(splittedString[1])
                  resolve(objectString)
                } else {
                  // no artist finded
                  // default case: "Artist - Song"
                  objectString.song = splittedString[1];
                  objectString.artists.push(splittedString[0])
                  resolve(objectString)
                }
              }).catch(function (error) {
                resolve(objectString)
              })
            } else {
              // 1° case: "Artist - Song"
              objectString.song = splittedString[1];
              objectString.artists.push(splittedString[0])
              resolve(objectString)
            }
          }).catch(function (error) {
            resolve(objectString)
          })
        }
        if ((splittedString[0].indexOf("feat.") > -1)) {
          // 2° case: "Artist feat. Artist - Song"
          objectString.song = splittedString[1];
          splittedString[0].split("feat.").forEach(artistName => {
            objectString.artists.push(artistName)
          })
          resolve(objectString)
        }
        if ((splittedString[1].indexOf("feat.") > -1)) {
          // 3° case: "Artist - Song feat. Artist" oppure "Song - Artist feat. Artist"
          objectString.artists.push(splittedString[0])
          splittedString[1].split("feat.").forEach((artistName, index) => {
            if (index == 0) {
              // song
              objectString.song = artistName;
            } else {
              // artists
              objectString.artists.push(artistName)
            }
          })
          resolve(objectString)
        }
      } else {
        resolve(objectString)
      }
    })
  },

  show(response, id) {
    return self.getVideoByYoutubeId(id).then(function (video) {
      return youtubeApi.getCommentByVideoId(video.youtube_id).then(function (commentList) {
        response.render('pages/video/video', {
          video: video,
          comments: commentList
        })
      }).catch(function (error) {
        response.send(error)
      })
    }).catch(function (error) {
      response.send(error)
    })
  },

  getVideoInfoFromYoutubeApi(response, id) {
    return new Promise((resolve, reject) => {
      youtubeApi.getVideoById(id).then(function (results) {
        resolve(results.items)
      }).catch(function (error) {
        resolve(null)
      })
    })
  },

  index(response, searchString, searchType, pageToken, numberResult) {
    youtubeApi.search(searchString, numberResult, pageToken, searchType).then(function (results) {
      response.render('pages/search/search', {
        data: results.items,
        request: {
          searchString: searchString,
          searchType: searchType,
          nextPage: results.nextPageToken,
          previousPage: results.prevPageToken
        }
      })
    }).catch(function (error) {
      response.send(error)
    })
  },

  create(response, youtubeId) {
    return new Promise((resolve, reject) => {
      return self.getVideoInfoFromYoutubeApi(null, youtubeId).then(function (videoObject) {
        return self._findArtistAndSongByString(videoObject[0].snippet.title).then(function (objectString) {
          objectString.artists.forEach((artist, index) => {
            objectString.artists[index] = String(objectString.artists[index].trim())
            objectString.artists[index] = String(objectString.artists[index].replace(/^\s+|\s+$/g, ""))
            objectString.artists[index] = String(objectString.artists[index].replace(/\s+$/g, ''))
            objectString.artists[index] = DataHelper.capitalizeEachLetterAfterSpace(objectString.artists[index])
            objectString.artists[index] = String(objectString.artists[index].trim())
          })
          objectString.song = String(objectString.song.trim())
          objectString.song = String(objectString.song.replace(/^\s+|\s+$/g, ""))
          objectString.song = String(objectString.song.replace(/\s+$/g, ''))
          objectString.song = DataHelper.capitalizeEachLetterAfterSpace(objectString.song)
          objectString.song = String(objectString.song.trim())
          const d = new Date()
          console.log("");
          console.log("[" + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds() + "]:  ", objectString);
          var song = objectString.song;
          // delete some bad remnant from song title parsing 
          song = song.split('(')[0];
          song = song.split('feat.')[0];
          var artists = objectString.artists;
          return self.getVideoByYoutubeId(videoObject[0].id).then(function (videoDB) {
            if (videoDB != null) {
              // video exist
              resolve(videoDB)
            } else {
              return ChannelsController.findOrCreateChannel(videoObject[0].snippet.channelId, videoObject[0].snippet.channelTitle).then(function (channelCreated) {
                // video not exist
                var video = {
                  title: videoObject[0].snippet.title,
                  description: videoObject[0].snippet.description,
                  FKChannelId: channelCreated.id,
                  views: 0,
                  youtube_id: videoObject[0].id,
                  image_url: videoObject[0].snippet.thumbnails.medium.url,
                  song_name: song
                }
                return self.storeVideo(video).then(function (videoCreated) {
                  var promiseArray = [];
                  if (artists) {
                    artists.forEach(artist => {
                      promiseArray.push(ArtistsController.create(null, artist))
                    })
                  }
                  Promise.all(promiseArray)
                    .then(data => {
                      var promiseArray2 = [];
                      data.forEach(artistCreated => {
                        if (artistCreated != null) {
                          promiseArray2.push(ORMHelper.storeVideoAndArtistAssociation(artistCreated.id, videoCreated.id))
                        }
                      })
                      Promise.all(promiseArray2).then(data => {
                        // return video created
                        resolve(videoCreated)

                        // genere and song sbtract
                        self.tryToCreateSongAndGenreAbstract(videoCreated).catch(error => {})
                      }).catch(error => {
                        // return video created
                        resolve(videoCreated)
                      })
                    }).catch(error => {
                      // no artist created but anyway return the video created
                      resolve(videoCreated)
                    })
                }).catch(function (error) {
                  reject(error)
                })
              }).catch(function (error) {
                reject(error)
              })
            }
          }).catch(function (error) {
            reject(error)
          })
        }).catch(function (error) {
          reject(error)
        })
      }).catch(function (error) {
        response.status(400).send("video not available")
        // reject(error)
      })
    })
  },

  addView(response, userId, videoId) {
    self.getVideoByYoutubeId(videoId).then(function (videoObject) {
      if (!videoObject) {
        response.send('no video found')
      } else {
        // save video history
        self.storeUserAndVideoHistoryCompleteAssociation(userId, videoObject.id)
        if (!videoObject) {
          response.send('no video found')
        } else {
          return videoObject.increment('views', {
            by: 1
          }).then(function (results) {
            response.send(results)
          }).catch(function (error) {
            reject(error)
          })
        }
      }
    })
  },

  getVideoByYoutubeId(videoId) {
    return new Promise((resolve, reject) => {
      Video.findOne({
        include: [{
            model: Artist
          },
          {
            model: Channel
          },
          {
            model: User
          },
          {
            model: Genre
          }
        ],
        where: {
          youtube_id: videoId
        }
      }).then(results => {
        resolve(results)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  getVideoById(videoId) {
    return new Promise((resolve, reject) => {
      Video.findOne({
        include: [{
            model: Artist
          },
          {
            model: Channel
          },
          {
            model: Genre
          }
        ],
        where: {
          id: videoId
        }
      }).then(results => {
        resolve(results)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  storeVideo(videoObject) {
    return new Promise((resolve, reject) => {
      var video = Video.build(videoObject, {
        title: utf8.encode(videoObject.title),
        description: utf8.encode(videoObject.description),
        //FKChannelId: videoObject.channelId,
        views: videoObject.views,
        youtube_id: videoObject.youtube_id,
        image_url: videoObject.image_url,
        song_name: utf8.encode(videoObject.song_name)
      })
      video.save().then(videoCreated => {
        resolve(videoCreated)
      }).catch((error) => {
        reject(error)
      })
    })
  },

  storeUserAndVideoHistoryPartialAssociation(userId, videoId) {
    // self.getVideoByYoutubeId(youtubeId).then(function(video) {
    var association = {
      FKUserId: userId,
      FKVideoId: videoId,
      complete: 0
    };
    var viewsHistoryObject = ViewsHistory.build(association, {
      FKUserId: association.FKUserId,
      FKVideoId: association.FKVideoId
    })
    viewsHistoryObject.save().then(viewHistoryCreated => {}).catch((error) => {})
    // })
  },

  tryToCreateSongAndGenreAbstract(videoCreated) {
    return new Promise((resolve, reject) => {
      // get dpedia info about this song
      self._getSongDbpediaInfo(videoCreated.id).then(songInfo => {
        if (songInfo) {
          // info founded
          // create video genre
          GenresController.findOrCreateGenre(songInfo.genre.value, songInfo.genreUrl.value).then(function (genreObject) {
            // update video with abstract finded and genre reference
            self._updateVideoWithGenreAndDbpediaInfo(videoCreated.id, genreObject.id, songInfo).catch(function (error) {})
            resolve({})
          }).catch(function (error) {
            reject(error)
          })
        }
        resolve({})
      }).catch(error => {
        reject(error)
      })
    })
  },

  _getSongDbpediaInfo(id) {
    return new Promise((resolve, reject) => {
      var promises = [];
      self.getVideoById(id).then(function (videoObject) {
        videoObject.Artists.forEach((artistObject, index) => {
          promises.push(SparqlController.getSongInfo(artistObject.name, videoObject.song_name))
        })
        Promise.all(promises).then(data => {
            var songInfo = null;
            var trovato = false;
            data.forEach((songInfoResults, index) => {
              if (!trovato && songInfoResults && songInfoResults.results != null && songInfoResults.results.bindings.length > 0) {
                songInfo = songInfoResults.results.bindings[0];
                trovato = true;
              }
            })
            resolve(songInfo)
          })
          .catch(error => {
            resolve(null)
          })
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  storeUserAndVideoHistoryCompleteAssociation(userId, videoId) {
    var association = {
      FKUserId: userId,
      FKVideoId: videoId,
      complete: 1
    };
    ViewsHistory.findAll({
      limit: 1,
      where: {
        FKUserId: userId
      },
      order: [
        ['createdAt', 'DESC']
      ]
    }).then(function (entries) {
      if (entries[0].FKVideoId != association.FKVideoId) {
        var viewsHistoryObject = ViewsHistory.build(association, {
          FKUserId: association.FKUserId,
          FKVideoId: association.FKVideoId
        })
        viewsHistoryObject.save().then(viewHistoryCreated => {})
          .catch((error) => {})
      } else {
        // the last video's id created match with this id
        if (entries[0].complete == 0) {
          // this video is the last watched but not for almost 15 sec
          ViewsHistory.update({
              complete: 1 // Set Attribute values
            }, {
              where: {
                id: entries[0].id
              }
            })
            .then(function () {}).error(function (error) {})
        }
      }
    })
  },

  _updateVideoWithGenreAndDbpediaInfo(videoId, genreId, songInfo) {
    return Video.update({
      dbpedia_abstract: songInfo.abstract ? songInfo.abstract.value : "",
      album: songInfo.album ? songInfo.album.value : "",
      FKGenreId: genreId
    }, {
      where: {
        id: videoId
      }
    })
  },

  showSuggestionedVideos(response) {
    return new Promise((resolve, reject) => {
      var promises = [];
      vitaliListaObject.forEach(video => {
        promises.push(self.getVideoInfoFromYoutubeApi(null, video.videoID))
      })
      Promise.all(promises)
        .then(videosData => {
          response.render('pages/video/suggestioned', {
            data: videosData
          })
        })
        .catch(error => {
          reject(error)
        })
    })
  },

  showSuggestionedByUs(response, genere) {
    var promises = [];
    ourSuggestionedList[genere].forEach(videoId => {
      promises.push(self.getVideoInfoFromYoutubeApi(null, videoId))
    })
    Promise.all(promises)
      .then(videosData => {
        response.render('pages/video/suggestioned-by-us', {
          data: videosData
        })
      })
      .catch(error => {
        response.send(error)
      })
  }

}