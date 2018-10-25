////////////////////////////////////////////////////////////////////////////////
var AuthController = require('./AuthController.js');
var VideoHelper = require('./helpers/VideoHelper.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var Promise = require('bluebird');
// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

module.exports = class TestController {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    // nothing to do
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  show(response, id) {
    youtubeApi.getVideoById(id).then(function (results) {
      response.render('pages/video/video', {
        video: results.items[0]
      });
    }).catch(function (error) {
      response.send(error);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show list of videos
  index(response, searchString, searchType, pageToken, numberResult) {
    console.log("[" + pageToken + "]");
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
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // init artists
  initializeArtists(response) {
    // leggere tutti gli artisti nel json
    var array = [2];
    for (var i = 0; i < 2; i++) {
      array[i] = VideoHelper.songNameFormatter("Thirty Seconds to Mars", "This is War");
    }
    response.send(array);
    // cercare l'url vero di riferimento su dbpedia
    // importare i dati
  }
}

//per ogni nome che trovo creo un array di oggetti