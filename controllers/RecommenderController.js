////////////////////////////////////////////////////////////////////////////////
var RecommenderHelper = require('./helpers/RecommenderHelper.js');
var VideosController = require('./VideosController.js');
var AjaxRequestClass = require('../libraries/AjaxRequest.js');
var youtubeRelatedd = require('../libraries/YoutubeApi.js');
var youtubeRelated = new youtubeRelatedd();
var AjaxRequest = new AjaxRequestClass();

var ViewsHistory = require("../models/ViewsHistory.js");
var User = require("../models/User.js");
var Video = require("../models/Video.js");
var Channel = require("../models/Channel.js");
const Sequelize = require('sequelize');

const otherGroupsLinks = require('../json/otherGroupsLinks.json');
////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {
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
  localRelativePopularity(response, videoId) {
    return new Promise((resolve, reject) => {
      ViewsHistory.findAll({
        // INFO: no filters on user id
        // where: {
        //   FKUserId: userId   
        // },
        order: [
          ['id', 'ASC']
        ],
        limit: 20
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
    return new Promise((resolve, reject) => {
      Video.findAll({
        include: [{
          model: Channel
        }],
        order: Sequelize.literal('rand()'),
        limit: 20
      }).then(function (videoRandom) {
        resolve(videoRandom);
      }).catch(function (error) {
        console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  recent(response, userId) {
    return new Promise((resolve, reject) => {
      Video.findAll({
        include: [{
            model: User,
            where: {
              id: userId
            }
          },
          {
            model: Channel
          }
        ],
        limit: 20,
        order: [
          ['updatedAt', 'DESC']
        ],
        group: ['youtube_id']
      }).then(function (videoRecent) {
        resolve(videoRecent);
      }).catch(function (error) {
        reject(error);
      });
    })
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  localAbsolutePopularity(response) {
    return new Promise((resolve, reject) => {
      Video.findAll({
        include: [{
          model: Channel
        }],
        order: [
          ['views', 'DESC']
        ],
        limit: 20
      }).then(function (videoFound) {
        resolve(videoFound)
      }).catch(function (error) {
        console.log("%j", error);
        reject(error);
      })
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  related(response, id) {
    return new Promise((resolve, reject) => {
      youtubeRelated.getVideoRelatedById(id, 20).then(function (results) {
        resolve(results);
      }).catch(function (error) {
        console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  globalRelativePopularity(response, videoId) {
    return new Promise((resolve, reject) => {
      self.localRelativePopularity(null, videoId).then(function (videosFounded) {
        VideosController.getVideoById(videoId).then(function (videoObject) {
            var promises = [];
            otherGroupsLinks.urls.forEach((url, index) => {
              promises.push(AjaxRequest.jsonRequest(url + videoObject.youtube_id, 'GET', {}));
            });
            Promise.all(promises)
              .then(function (groupsVideos) {
                var promises2 = [];
                var videoResults = RecommenderHelper.globalRelativePopularity(videosFounded, groupsVideos);
                // foreach video calculated
                videoResults.forEach(video => {
                  promises2.push(VideosController._getVideoInfo(null, video.id));
                });
                Promise.all(promises2)
                  .then(videosData => {
                    resolve(videosData);
                  })
                  .catch(error => {
                    console.log("%j", error);
                    reject(error);
                  });
              })
              .catch(function (error) {
                console.log("%j", error);
                resolve(null);
              });
          })
          .catch(function (error) {
            console.log("%j", error);
            reject(error);
          });
      }).catch(function (error) {
        console.log("%j", error);
        reject(error);
      });
    });
  },
};

var VideosController = require('./VideosController.js');