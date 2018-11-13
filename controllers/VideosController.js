////////////////////////////////////////////////////////////////////////////////
var ChannelsController = require('./ChannelsController.js');
var ArtistsController = require('./ArtistsController.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var ORMHelper = require('./helpers/ORMHelper.js');
var Artist = require("../models/Artist.js");
var Video = require("../models/Video.js");
var Channel = require("../models/Channel.js");
var vitaliListaObject = require ("../json/video-vitali.json")
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
          // 1° case: "Artist - Song"
          objectString.song = splittedString[1];
          objectString.artists.push(splittedString[0]);
          resolve(objectString);
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
      response.render('pages/video/video', {
        video: video
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
        resolve(results);
        // response.send(results.items[0]);
      }).catch(function (error) {
        console.log(error);
        reject(error);
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
          return self._findArtistAndSongByString(videoObject.items[0].id, videoObject.items[0].snippet.title).then(function (objectString) {
            var song = objectString.song;
            var artists = objectString.artists;
            return self.getVideoById(videoObject.items[0].id).then(function (videoDB) {
              if (videoDB!=null) {
                // video exist
                resolve(videoDB);
              } else {
                ChannelsController.findOrCreateChannel(videoObject.items[0].snippet.channelId, videoObject.items[0].snippet.channelTitle).then(function(channelCreated) {
                // video not exist
                var video = {
                  title: videoObject.items[0].snippet.title,
                  description: videoObject.items[0].snippet.description,
                  FKChannelId: channelCreated.id,
                  views: 0,
                  youtube_id: videoObject.items[0].id,
                  image_url: videoObject.items[0].snippet.thumbnails.medium.url,
                }
                return self.storeVideo(video).then(function (videoCreated) {
                  var promiseArray = [];
                  artists.forEach(artist => {
                    promiseArray.push(ArtistsController.create(null, artist));
                  });
                  return Promise.all(promiseArray)
                    .then(data => {
                      var promiseArray2 = [];
                      data.forEach(artistCreated => {
                        if(artistCreated!=null) {
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
        response.send('il video non ce')
      } else {
        Video.findById(videoObject.id).then(video => {
          return video.increment('views', {
            by: 1
          })
        })
        response.send(videoObject);
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

  showListaDiPartenza(response){
    response.send(vitaliListaObject);
    // response.render('pages/vitali/vitali', {
    //   data : vitaliListaObject
    // });
  }

};