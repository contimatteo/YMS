////////////////////////////////////////////////////////////////////////////////
var ChannelsController = require('./ChannelsController.js');
var ArtistsController = require('./ArtistsController.js');
var RecommenderController = require('./RecommenderController.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var ORMHelper = require('./helpers/ORMHelper.js');
var Artist = require("../models/Artist.js");
var Video = require("../models/Video.js");
var Channel = require("../models/Channel.js");
var vitaliListaObject = require("../json/video-vitali.json")
var Promise = require('bluebird');
// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {

  _findArtistAndSongByString(youtubeId, string) {
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
                  console.log("si questo è il caso");
                  // 1° case: "Song - Artist"
                  objectString.song = splittedString[0];
                  objectString.artists.push(splittedString[1]);
                  resolve(objectString);
                }
                else {
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
    self.getVideoById(id).then(function (video) {
      var recommender = [];
      // import vitali recommender
      recommender.push(RecommenderController.vitali(id));
      // import random recommender
      // recommender.push(RecommenderController.random(id));
      // get all recommender
      Promise.all(recommender)
        .then(recommenderData => {
          response.render('pages/video/video', {
            video: video,
            recommenderVitali: recommenderData[0]
            // recommenderRandom: data[1]
          });
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
      // response.send(results.items[0]);
    }).catch(function (error) {
      console.log(error);
      response.send(error);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  _getVideoInfo(response, id) {
    return new Promise((resolve, reject) => {
      youtubeApi.getVideoById(id).then(function (results) {
        resolve(results.items);
        // response.send(results.items[0]);
      }).catch(function (error) {
        console.log(error);
        resolve(null);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show list of videos
  index(response, searchString, searchType, pageToken, numberResult) {
    youtubeApi.search(searchString, numberResult, pageToken).then(function (results) {
      // response.send(results);
      response.render('pages/search/search', {
        data: results.items,
        request: {
          "searchString": searchString,
          "searchType": searchType,
          "nextPage": results.nextPageToken,
          "previousPage": results.prevPageToken
        }
      });
    }).catch(function (error) {
      console.log(error);
      response.send(error.reasonPhrase);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  create(response, youtubeId) {
    return new Promise((resolve, reject) => {
      return self._getVideoInfo(null, youtubeId).then(function (videoObject) {
          return self._findArtistAndSongByString(videoObject[0].id, videoObject[0].snippet.title).then(function (objectString) {
            var song = objectString.song;
            var artists = objectString.artists;
            return self.getVideoById(videoObject[0].id).then(function (videoDB) {
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
                            resolve(videoCreated);
                          })
                          .catch(error => {
                            console.log(error);
                            reject(error);
                          });
                      })
                      .catch(error => {
                        console.log(error);
                        reject(error);
                      });
                  }).catch(function (error) {
                    console.log(error);
                    reject(error);
                  });
                }).catch(function (error) {
                  console.log(error);
                  reject(error);
                });
              }
            }).catch(function (error) {
              console.log(error);
              reject(error);
            });
          }).catch(function (error) {
            console.log(error);
            reject(error);
          });
        })
        .catch(function (error) {
          response.send(error);
        });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  addView(response, userId, videoId) {
    self.getVideoById(videoId).then(function (videoObject) {
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
  getVideoById(videoId) {
    return new Promise((resolve, reject) => {
      Video.findOne({
        include: [{
            model: Artist
          },
          {
            model: Channel
          }
        ],
        where: {
          youtube_id: videoId
        }
      }).then(results => {
        resolve(results);
      }).catch((error) => {
        console.log(error);
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
        image_url: videoObject.image_url
      });
      video.save().then(videoCreated => {
        resolve(videoCreated);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  showSuggestionedVideos(response) {
    response.send(vitaliListaObject);
    // 1. creare un array con tutti gli id di vitali ["id1", "id2", ...]
    // 2. sequelize find all where : id: [...]
    // 3. renderizzi la view (prendere quella di ricerca) dove hai i campi del db

    // response.render('pages/vitali/vitali', {
    //   data : vitaliListaObject
    // });
  }

};