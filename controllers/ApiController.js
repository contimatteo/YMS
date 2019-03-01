var ViewsHistory = require("../models/ViewsHistory.js")
var Video = require("../models/Video.js")
var Artist = require("../models/Artist.js")
var Channel = require("../models/Channel.js")
var Genre = require("../models/Genre.js")
var User = require("../models/User.js")

var VideosController = require('./VideosController.js')
var RecommenderController = require('./RecommenderController.js')

var RecommenderHelper = require('./helpers/RecommenderHelper.js')
var constants = require('./helpers/ConstantsHelper.js')

var GlobpopJson = require('../libraries/schemas/GlobpopJson.js')

var self = module.exports = {

  globpop(youtubeId) {
    // BUG: function logic wrong!
    // if req.query.id is setted then --> return local relative popularity
    // else return global relative popularity
    return new Promise((resolve, reject) => {
      VideosController.getVideoByYoutubeId(youtubeId).then(function (videoObject) {
          ViewsHistory.findAll({
              order: [
                ['id', 'ASC']
              ]
            }).then(results => {
              var promises = [];

              if (videoObject) {
                var videoFounded = RecommenderHelper.localRelativePopularityCounter(results, videoObject.id)
                var idVideoList = [];

                videoFounded.forEach(video => {
                  idVideoList.push(video.videoId)
                  promises.push(VideosController.getVideoById(video.videoId))
                })

                Video.findAll({
                    include: [Artist, Channel, Genre, User],
                    where: {
                      id: idVideoList
                    },
                    limit: constants.recommenderVideosNumber
                  }).then(videoRecommended => {
                    var jsonResponse = new GlobpopJson(videoObject.youtube_id, videoObject.views, videoObject.updatedAt)
                    videoRecommended.forEach((videoFounded, index) => {
                      jsonResponse.addVideoRecommended(videoFounded.youtube_id, videoFounded.views, videoFounded.updatedAt)
                    })
                    resolve(jsonResponse)
                  })
                  .catch((error) => {
                    var jsonResponse = new GlobpopJson(youtubeId, 0, "")
                    resolve(jsonResponse)
                  })
                return
              }

              var jsonResponse = new GlobpopJson(youtubeId, 0, "")
              resolve(jsonResponse)
            })
            .catch((error) => {
              var jsonResponse = new GlobpopJson(youtubeId, 0, "")
              resolve(jsonResponse)
            })
        })
        .catch(function (error) {
          var jsonResponse = new GlobpopJson(youtubeId, 0, "")
          resolve(jsonResponse)
        })
    })
  },

  globpopAssolute() {
    return new Promise((resolve, reject) => {
      RecommenderController.localAbsolutePopularity(null).then((results) => {
        var jsonResponse = new GlobpopJson(null, null, null)
        results.forEach((videoFounded, index) => {
          jsonResponse.addVideoRecommended(videoFounded.youtube_id, videoFounded.views, videoFounded.updatedAt)
        })
        resolve(jsonResponse)
      }).catch((e) => {
        var jsonResponse = new GlobpopJson(null, null, null)
        resolve(jsonResponse)
      })
    })
  }

}