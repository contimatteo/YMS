////////////////////////////////////////////////////////////////////////////////
var AuthController = require('./AuthController.js');
var ArtistsController = require('./ArtistsController.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var ORMHelper = require('./helpers/ORMHelper.js');
var Video = require("../models/Video.js");
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
        // 1° case: "Artist - song"
        // 2° case: "Artist feat. Artist - song"
        // 3° case: "Artist - song feat. Artist"
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
          ArtistsController.getArtistInfo(null, splittedString[0]).then(function (artist) {
              if (artist != null) {
                // case finded: "Artist - Song feat. Artist"
                console.log("Artist - Song feat. Artist");
                resolve("Artist - Song feat. Artist");
              } else {
                // case finded: "Song - Artist feat. Artist"
                console.log("Song - Artist feat. Artist");
                resolve("Song - Artist feat. Artist");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        }
        // // split various artist
        // objectString.artists = splittedString[0].split("feat.");
        // if (objectString.artists.length < 1) {
        //   objectString.artists = splittedString[0].split("Feat.");
        // }
        // // foreach artist finded
        // objectString.artists.forEach(artist => {
        //   artist = artist.trim();
        //   artist = artist.replace(/ *\([^)]*\) */g, "");
        //   artist = artist.trim();
        // });
      } else {
        resolve("titolo non valido");
      }
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  show(response, id) {
    youtubeApi.getVideoById(id).then(function (results) {
      response.render('pages/video/video', {
        video: results.items[0]
      });
      // response.send(results.items[0]);
    }).catch(function (error) {
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
            return ORMHelper.getVideoById(videoObject.items[0].id).then(function (videoDB) {
              if (videoDB.length > 0) {
                // video exist
                resolve("video già presente");
              } else {
                // video not exist
                var video = {
                  title: videoObject.items[0].snippet.title,
                  description: videoObject.items[0].snippet.description,
                  FKChannelId: null,
                  views: 0,
                  youtube_id: videoObject.items[0].id,
                }
                return ORMHelper.storeVideo(video).then(function (videoCreated) {
                  var promiseArray = [];
                  artists.forEach(artist => {
                    promiseArray.push(ArtistsController.create(null, artist));
                  });
                  return Promise.all(promiseArray)
                    .then(data => {
                      var promiseArray2 = [];
                      data.forEach(artistCreated =>  {
                        console.log("id artista creato: " + artistCreated.id);
                        promiseArray2.push(ORMHelper.storeVideoAndArtistAssociation(artistCreated.id, videoCreated.id));
                      })
                      return Promise.all(promiseArray2).then(data => {
                        resolve(data);
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
              }
            }).catch(function (error) {
              reject(error);
            });
          }).catch(function (error) {
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
    ORMHelper.getVideoById(videoId).then(function (videoObject) {
      if (!videoObject) {
        // aggiungere il video al db
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
  }

};