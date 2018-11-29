////////////////////////////////////////////////////////////////////////////////

var ViewsHistory = require("../models/ViewsHistory.js");
var Video = require("../models/Video.js");
var Artist = require("../models/Artist.js");
var Channel = require("../models/Channel.js");
var Genre = require("../models/Genre.js");
var User = require("../models/User.js");
var Promise = require('bluebird');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var VideosController = require('./VideosController.js');
var RecommenderHelper = require('./helpers/RecommenderHelper.js');
var constants = require('./helpers/ConstantsHelper.js');
// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {

  globpop(youtubeId) {
    return new Promise((resolve, reject) => {
      VideosController.getVideoByYoutubeId(youtubeId).then(function (videoObject) {
        ViewsHistory.findAll({
          order: [
            ['id', 'ASC']
          ],
          limit: constants.recommenderVideosNumber
        }).then(results => {
          var promises = [];
          var videoFounded = RecommenderHelper.localRelativePopularityCounter(results, videoObject.id);
          var idVideoList = [];
          videoFounded.forEach(video => {
            idVideoList.push(video.videoId);
            promises.push(VideosController.getVideoById(video.videoId));
          });
          console.log(idVideoList);
          Video.findAll({
            include: [Artist, Channel, Genre, User],
            where: {
              id: idVideoList
            },
            limit: constants.recommenderVideosNumber
          }).then(videoRecommended => {
            resolve(videoRecommended);
          })
          .catch((error) => {
            console.log("45 %j", error);
            reject(error);
          });
        })
        .catch((error) => {
          console.log("49 %j", error);
          reject(error);
        });
      })
      .catch(function (error) {
        console.log("53 %j", error);
        resolve(null);
      })
    });
  },

};