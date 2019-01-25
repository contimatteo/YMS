////////////////////////////////////////////////////////////////////////////////

var ViewsHistory = require("../models/ViewsHistory.js");
var Video = require("../models/Video.js");
var Artist = require("../models/Artist.js");
var Channel = require("../models/Channel.js");
var Genre = require("../models/Genre.js");
var User = require("../models/User.js");
// var Promise = require('bluebird');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var VideosController = require('./VideosController.js');
var RecommenderHelper = require('./helpers/RecommenderHelper.js');
var constants = require('./helpers/ConstantsHelper.js');
var JsonAPI = require('../libraries/schemas/JsonAPI.js')
// const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {

  globpop(youtubeId) {
    return new Promise((resolve, reject) => {
      VideosController.getVideoByYoutubeId(youtubeId).then(function (videoObject) {
        ViewsHistory.findAll({
          order: [
            ['id', 'ASC']
          ]
        }).then(results => {
          var promises = [];
          var videoFounded = RecommenderHelper.localRelativePopularityCounter(results, videoObject.id);
          var idVideoList = [];
          videoFounded.forEach(video => {
            idVideoList.push(video.videoId);
            promises.push(VideosController.getVideoById(video.videoId));
          });
          Video.findAll({
            include: [Artist, Channel, Genre, User],
            where: {
              id: idVideoList
            },
            limit: constants.recommenderVideosNumber
          }).then(videoRecommended => {
            var jsonResponse = new JsonAPI(videoObject.youtube_id, videoObject.views, videoObject.updatedAt);
            videoRecommended.forEach((videoFounded, index) => {
              jsonResponse.addVideoRecommended(videoFounded.youtube_id, videoFounded.views, null);
            })
            resolve(jsonResponse);
          })
          .catch((error) => {
            reject(error);
          });
        })
        .catch((error) => {
          var jsonResponse = new JsonAPI(youtubeId, 0, "");
          reject(jsonResponse);
        });
      })
      .catch(function (error) {
        resolve(null);
      })
    });
  },

};