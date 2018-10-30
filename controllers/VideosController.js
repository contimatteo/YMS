////////////////////////////////////////////////////////////////////////////////
var AuthController = require('./AuthController.js');
var ArtistsController = require('./ArtistsController.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var Promise = require('bluebird');
// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {
  
  _findArtistAndSongByString(string) {
    return new Promise(function (resolve, reject) {
      var objectString = {
        artist: "",
        song: ""
      };
      string = string.trim();
      var splittedString = string.split("-");
      if (splittedString.length < 1) {
        splittedString = string.split(":");
      }
      splittedString.forEach(element => {
        element = element.trim();
        element = element.replace(/ *\([^)]*\) */g, "");
        element = element.replace(/ *\[[^\]]*\] */g, '');
        element = element.replace(/ *\{[^)]*\} */g, "");
        element = element.trim();
      });
      var objectArtist;
      ArtistsController.getArtistInfo(null, splittedString[0]).then(function (result) {
          var artistData = result.results.bindings[0];
          // check if this is artist or not
          // if is artist ok!!
          // if is not artist resolve with error: invert artist and song
          resolve(artistData);
        })
        .catch(function (error) {
          reject(error);
        });
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
  create(response, title) {
    return new Promise(function (resolve, reject) {
      self._findArtistAndSongByString(title).then(function (objectString) {
          var song = objectString.song;
          var artist = objectString.artist;
          resolve(objectString);
        })
        .catch(function (error) {
          reject(error);
        });
    });
  }
};

//per ogni nome che trovo creo un array di oggetti