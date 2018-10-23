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
  index(request, response, searchString, numberResult) {
    youtubeApi.search(searchString, numberResult).then(function (results) {
      response.render('pages/search/search', {
        data: results.items
      });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // init artists
  initializeArtists(response) {
    // leggere tutti gli artisti nel json
    var object={link1:"", link2:"", link3:""};
    VideoHelper.songNameFormatter("Thirty Seconds to Mars", "This is War",object);
    response.send(object);
    // cercare l'url vero di riferimento su dbpedia
    // importare i dati
  }
}

//per ogni nome che trovo creo un array di oggetti 