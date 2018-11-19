////////////////////////////////////////////////////////////////////////////////
var RecommenderHelper = require('./helpers/RecommenderHelper.js');
var VideosController = require('./VideosController.js');
var AjaxRequestClass = require('../libraries/AjaxRequest.js');
var AjaxRequest = new AjaxRequestClass();
var ViewsHistory = require("../models/ViewsHistory.js");
////////////////////////////////////////////////////////////////////////////////

// module.exports = class TestController {
module.exports = {
  // fvitali get request
  vitali(id) {
    return new Promise((resolve, reject) => {
      var url = "http://site1825.tw.cs.unibo.it/TW/globpop?id=" + id;
      AjaxRequest.jsonRequest(url, 'GET', {}).then(function (vitaliResponse) {
        var promises = [];
        vitaliResponse.recommended.forEach(video => {
          promises.push(VideosController._getVideoInfo(null, video.videoID));
        });
        Promise.all(promises)
          .then(videosData => {
            resolve(videosData);
          })
          .catch(error => {
            console.log("%j", error);
            resolve(null);
          });
      }).catch((error) => {
        console.log("%j", error);
        resolve(null);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  localRelativePopularity(response, userId, videoId) {
    return new Promise((resolve, reject) => {
      ViewsHistory.findAll({
        where: {
          FKUserId: userId
        },
        order: [
          ['id', 'ASC']
        ]
      }).then(results => {
        var promises = [];
        var videoFounded = RecommenderHelper.localRelativePopularityCounter(results, videoId);
        videoFounded.forEach(video => {
          promises.push(VideosController.getVideoById(video.videoId));
        });
        Promise.all(promises)
          .then(videosData => {
            resolve(videosData);
          })
          .catch(error => {
            console.log("%j", error);
            reject(error);
          });
      }).catch((error) => {
        console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  random(response) {
    Video.findAll({
      order: 'random()',
      limit: 25
    }).then(function (videoRandom) {
      response.send(videoRandom)
    }).catch(function (error) {
      console.log("%j", error);
      response.send(error);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  recent(response) {
    Video.findAll({
      order: 'random()',
      limit: 25
    }).then(function (videoRandom) {
      response.send(videoRandom)
    }).catch(function (error) {
      console.log("%j", error);
      response.send(error);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};

var VideosController = require('./VideosController.js');