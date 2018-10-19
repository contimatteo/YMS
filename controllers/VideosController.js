////////////////////////////////////////////////////////////////////////////////
var AuthController = require('./AuthController.js');
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
      //response.send(results.items[0]);
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

}