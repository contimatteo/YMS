////////////////////////////////////////////////////////////////////////////////
var ChannelsController = require('./ChannelsController.js');
var GenresController = require('./GenresController.js');
var ArtistsController = require('./ArtistsController.js');
var SparqlController = require('./SparqlController.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var ORMHelper = require('./helpers/ORMHelper.js');
var DataHelper = require('./helpers/DataHelper.js');
var Artist = require("../models/Artist.js");
var ViewsHistory = require("../models/ViewsHistory.js");
var Video = require("../models/Video.js");
var User = require("../models/User.js");
var Channel = require("../models/Channel.js");
var Genre = require("../models/Genre.js");
var vitaliListaObject = require("../json/video-vitali.json")
var ourSuggestionedList = require("../json/recommendedByUs.json")
var Promise = require('bluebird');
// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {

  _findArtistAndSongByString(string) {
    return new Promise(function (resolve, reject) {
      var objectString = {
        artists: [],
        song: ""
      };
      if ((string.indexOf("-") > -1)) {
        string = string.trim();
        var splittedString = string.split("-");
        if (splittedString.length < 1) {
          splittedString = string.split(":");
        }
        // split song and artist
        splittedString.forEach(function (element, index) {
          splittedString[index] = element.trim();
          splittedString[index] = splittedString[index].replace(/ *\([^)]*\) */g, "");
          splittedString[index] = splittedString[index].replace(/ *\[[^\]]*\] */g, '');
          splittedString[index] = splittedString[index].replace(/ *\{[^)]*\} */g, "");
          splittedString[index] = splittedString[index].replace(/ *\{[^)]*\} */g, "");
          splittedString[index] = splittedString[index].replace(/Feat./g, 'feat.');
          splittedString[index] = splittedString[index].replace(/Feat/g, 'feat.');
          splittedString[index] = splittedString[index].replace(/Featuring./g, 'feat.');
          splittedString[index] = splittedString[index].replace(/Featuring/g, 'feat.');
          splittedString[index] = splittedString[index].replace(/Ft./g, 'feat.');
          splittedString[index] = splittedString[index].replace(/Ft/g, 'feat.');
          splittedString[index] = splittedString[index].replace(/ft./g, 'feat.');
          splittedString[index] = splittedString[index].replace(/ft/g, 'feat.');
          splittedString[index] = splittedString[index].replace(/featuring./g, 'feat.');
          splittedString[index] = splittedString[index].replace(/featuring/g, 'feat.');
          // splittedString[index] = splittedString[index].replace(/feat./g, '^');
          splittedString[index] = splittedString[index].trim();
        });
        // find case
        if ((splittedString[0].indexOf("feat.") < 0) && (splittedString[1].indexOf("feat.") < 0)) {
          return ArtistsController.getArtistInfo(null, splittedString[0]).then(function (artistObject) {
            if (artistObject == null) {
              return ArtistsController.getArtistInfo(null, splittedString[1]).then(function (artistObject2) {
                if (artistObject2 != null) {
                  // 1° case: "Song - Artist"
                  objectString.song = splittedString[0];
                  objectString.artists.push(splittedString[1]);
                  resolve(objectString);
                } else {
                  // no artist finded
                  // default case: "Artist - Song"
                  objectString.song = splittedString[1];
                  objectString.artists.push(splittedString[0]);
                  resolve(objectString);
                }
              }).catch(function (error) {
                reject(error);
              });
            } else {
              // 1° case: "Artist - Song"
              objectString.song = splittedString[1];
              objectString.artists.push(splittedString[0]);
              resolve(objectString);
            }
          }).catch(function (error) {
            reject(error);
          });
        }
        if ((splittedString[0].indexOf("feat.") > -1)) {
          // 2° case: "Artist feat. Artist - Song"
          objectString.song = splittedString[1];
          splittedString[0].split("feat.").forEach(artistName => {
            objectString.artists.push(artistName);
          });
          resolve(objectString);
        }
        if ((splittedString[1].indexOf("feat.") > -1)) {
          // 3° case: "Artist - Song feat. Artist" oppure "Song - Artist feat. Artist"
          objectString.artists.push(splittedString[0]);
          splittedString[1].split("feat.").forEach((artistName, index) => {
            if (index == 0) {
              // song
              objectString.song = artistName;
            } else {
              // artists
              objectString.artists.push(artistName);
            }
          });
          resolve(objectString);
        }
      } else {
        resolve("titolo non valido");
      }
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  show(response, id) {
    self.getVideoByYoutubeId(id).then(function (video) {
      youtubeApi.getCommentByVideoId(video.youtube_id).then(function (commentList) {
        response.render('pages/video/video', {
          video: video,
          comments: commentList
        });
      }).catch(function (error) {
        response.send(error);
      });
    }).catch(function (error) {
      response.send(error);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  _getVideoInfo(response, id) {
    return new Promise((resolve, reject) => {
      youtubeApi.getVideoById(id).then(function (results) {
        resolve(results.items);
      }).catch(function (error) {
        resolve(null);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show list of videos
  index(response, searchString, searchType, pageToken, numberResult) {
    youtubeApi.search(searchString, numberResult, pageToken, searchType).then(function (results) {
      // response.send(results);
      response.render('pages/search/search', {
        data: results.items,
        request: {
          searchString: searchString,
          searchType: searchType,
          nextPage: results.nextPageToken,
          previousPage: results.prevPageToken
        }
      });
    }).catch(function (error) {
      response.send(error.reasonPhrase);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  create(response, youtubeId) {
    return new Promise((resolve, reject) => {
      return self._getVideoInfo(null, youtubeId).then(function (videoObject) {
          return self._findArtistAndSongByString(videoObject[0].snippet.title).then(function (objectString) {
            var song = objectString.song;
            // delete some bad remnant from song title parsing 
            song = song.split('(')[0];
            song = song.split('feat.')[0];
            var artists = objectString.artists;
            return self.getVideoByYoutubeId(videoObject[0].id).then(function (videoDB) {
              if (videoDB != null) {
                // video exist
                resolve(videoDB);
              } else {
                ChannelsController.findOrCreateChannel(videoObject[0].snippet.channelId, videoObject[0].snippet.channelTitle).then(function (channelCreated) {
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
                        promiseArray.push(ArtistsController.create(null, artist));
                      });
                    }
                    return Promise.all(promiseArray)
                      .then(data => {
                        var promiseArray2 = [];
                        data.forEach(artistCreated => {
                          if (artistCreated != null) {
                            promiseArray2.push(ORMHelper.storeVideoAndArtistAssociation(artistCreated.id, videoCreated.id));
                          }
                        })
                        return Promise.all(promiseArray2).then(data => {
                            // get dpedia info about this song
                            self.getSongDbpediaInfo(videoCreated.id).then(songInfo => {
                              // info founded
                              // create video genre
                              GenresController.findOrCreateGenre(songInfo.genre.value, songInfo.genreUrl.value).then(function (genreObject) {
                                // update video with abstract finded and genre reference
                                self.updateVideoWithGenreAndDbpediaInfo(videoCreated.id, genreObject.id, songInfo);
                              }).catch(function (error) {
                                reject(error);
                              });
                            }).catch(error => {
                              reject(error);
                            });
                            // return video created
                            resolve(videoCreated);
                          })
                          .catch(error => {
                            reject(error);
                          });
                      })
                      .catch(error => {
                        reject(error);
                      });
                  }).catch(function (error) {
                    reject(error);
                  });
                }).catch(function (error) {
                  reject(error);
                });
              }
            }).catch(function (error) {
              reject(error);
            });
          }).catch(function (error) {
            reject(error);
          });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  addView(response, userId, videoId) {
    self.getVideoByYoutubeId(videoId).then(function (videoObject) {
      // save video history
      self.storeUserAndVideoHistoryCompleteAssociation(userId, videoObject.id);
      if (!videoObject) {
        response.send('il video non ce');
      } else {
        return videoObject.increment('views', {
          by: 1
        }).then(function (results) {
          response.send(results);
        }).catch(function (error) {
          reject(error);
        });
      }
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
          }
        ],
        where: {
          youtube_id: videoId
        }
      }).then(results => {
        resolve(results);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
        resolve(results);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  storeVideo(videoObject) {
    return new Promise((resolve, reject) => {
      var video = Video.build(videoObject, {
        title: videoObject.title,
        description: videoObject.description,
        //FKChannelId: videoObject.channelId,
        views: videoObject.views,
        youtube_id: videoObject.youtube_id,
        image_url: videoObject.image_url,
        song_name: videoObject.song_name
      });
      video.save().then(videoCreated => {
        resolve(videoCreated);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
    });
    viewsHistoryObject.save().then(viewHistoryCreated => {}).catch((error) => {});
    // })
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getSongDbpediaInfo(id) {
    return new Promise((resolve, reject) => {
      var promises = [];
      self.getVideoById(id).then(function (videoObject) {
        var objectLink;
        videoObject.Artists.forEach((artistObject, index) => {
          objectLink = DataHelper.nameFormatter(artistObject.name, videoObject.song_name);
          promises.push(SparqlController.getSongInfo(objectLink.link1));
          promises.push(SparqlController.getSongInfo(objectLink.link2));
          promises.push(SparqlController.getSongInfo(objectLink.link3));
        });
        Promise.all(promises).then(data => {
            var songInfo = null;
            var trovato = false;
            data.forEach((songInfoResults, index) => {
              if (!trovato && songInfoResults != null && songInfoResults.results != null && songInfoResults.results.bindings.length > 0) {
                songInfo = songInfoResults.results.bindings[0];
                trovato = true;
              }
            });
            resolve(songInfo);
          })
          .catch(error => {
            resolve(null);
          });
      }).catch(function (error) {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
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
        });
        viewsHistoryObject.save().then(viewHistoryCreated => {})
          .catch((error) => {});
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
            .then(function () {}).error(function (error) {});
        }
      }
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  updateVideoWithGenreAndDbpediaInfo(videoId, genreId, songInfo) {
    Video.update({
      dbpedia_abstract: songInfo.abstract.value,
      FKGenreId: genreId
    }, {
      where: {
        id: videoId
      }
    }).success(function (results) {
      // all goes ok
    }).error(function (err) {
      // something went wrong
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  showSuggestionedVideos(response) {
    return new Promise((resolve, reject) => {
      var promises = [];
      vitaliListaObject.forEach(video => {
        promises.push(self._getVideoInfo(null, video.videoID));
      });
      Promise.all(promises)
        .then(videosData => {
          response.render('pages/video/suggestioned', {
            data: videosData
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  showSuggestionedByUsVideos(response, genere) {
    return new Promise((resolve, reject) => {
      var promises = [];
      ourSuggestionedList[genere].forEach(video => {
      promises.push(self._getVideoInfo(null, video.videoID));
      });
      Promise.all(promises)
        .then(videosData => {
          response.render('pages/video/suggestioned-by-us', {
            data: videosData
          });
        })
        .catch(error => {
          reject(error);
        });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

};