////////////////////////////////////////////////////////////////////////////////
var Promise = require('bluebird');
var RecommenderHelper = require('./helpers/RecommenderHelper.js');
var AjaxRequestClass = require('../libraries/AjaxRequest.js');
var youtubeRelatedd = require('../libraries/YoutubeApi.js');
var youtubeRelated = new youtubeRelatedd();
var AjaxRequest = new AjaxRequestClass();
var YoutubeApi = require('../libraries/YoutubeApi.js');
var constants = require('./helpers/ConstantsHelper.js');
var ViewsHistory = require("../models/ViewsHistory.js");
var User = require("../models/User.js");
var Video = require("../models/Video.js");
var Artist = require("../models/Artist.js");
var Channel = require("../models/Channel.js");
var Genre = require("../models/Genre.js");
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const otherGroupsLinks = require('../json/otherGroupsLinks.json');
const youtubeApi = Promise.promisifyAll(new YoutubeApi());
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
            // console.log("%j", error);
            resolve(null);
          });
      }).catch((error) => {
        // console.log("%j", error);
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
        limit: constants.recommenderVideosNumber
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
            // console.log("%j", error);
            reject(error);
          });
      }).catch((error) => {
        // console.log("%j", error);
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
        limit: constants.recommenderVideosNumber
      }).then(function (videoRandom) {
        resolve(videoRandom);
      }).catch(function (error) {
        // console.log("%j", error);
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
        limit: constants.recommenderVideosNumber,
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
        limit: constants.recommenderVideosNumber
      }).then(function (videoFound) {
        resolve(videoFound)
      }).catch(function (error) {
        // console.log("%j", error);
        reject(error);
      })
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  related(response, id) {
    return new Promise((resolve, reject) => {
      youtubeRelated.getVideoRelatedById(id, constants.recommenderVideosNumber).then(function (results) {
        resolve(results);
      }).catch(function (error) {
        // console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  globalAbsolutePopularity(videoId) {
    return new Promise((resolve, reject) => {
      self.localAbsolutePopularity(null).then(function (videosFounded) {
        return VideosController.getVideoById(videoId).then(function (videoObject) {
            var promises = [];
            otherGroupsLinks.urls.forEach((url, index) => {
              promises.push(AjaxRequest.jsonRequest(url + videoObject.youtube_id, 'GET', {}));
            });
            Promise.all(promises)
              .then(function (groupsVideos) {
                var promises2 = [];
                var videoResults = RecommenderHelper.globalAbsolutePopularity(videosFounded, groupsVideos);
                // foreach video calculated
                videoResults.forEach(video => {
                  promises2.push(VideosController._getVideoInfo(null, video.id));
                });
                Promise.all(promises2)
                  .then(videosData => {
                    resolve(videosData);
                  })
                  .catch(error => {
                    // console.log("%j", error);
                    reject(error);
                  });
              })
              .catch(function (error) {
                // console.log("%j", error);
                resolve(null);
              });
          })
          .catch(function (error) {
            // console.log("%j", error);
            reject(error);
          });
      }).catch(function (error) {
        // console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  globalRelativePopularity(videoId) {
    return new Promise((resolve, reject) => {
      self.localRelativePopularity(null, videoId).then(function (videosFounded) {
        return VideosController.getVideoById(videoId).then(function (videoObject) {
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
                    // console.log("%j", error);
                    reject(error);
                  });
              })
              .catch(function (error) {
                // console.log("%j", error);
                resolve(null);
              });
          })
          .catch(function (error) {
            // console.log("%j", error);
            reject(error);
          });
      }).catch(function (error) {
        // console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  artistSimilarity(res, videoId) {
    return new Promise((resolve, reject) => {
      VideosController.getVideoById(videoId).then(function (videoFounded) {
        if (videoFounded != null) {
          var promises = [];
          videoFounded.Artists.forEach(function (artist, index) {
            promises.push(ArtistsController.getRelatedArtistsById(artist.id));
          });
          Promise.all(promises)
            .then(artistsFounded => {
              var calculateArtistsAndVideosNumbers = RecommenderHelper.artistSimilarity(artistsFounded);
              var artistsRelatedNames = calculateArtistsAndVideosNumbers.artistsNames;
              var artistsVideosNumbers = calculateArtistsAndVideosNumbers.artistsVideosNumbers;
              var promises2 = [];
              for (var i = 0; i < artistsRelatedNames.length; i++) {
                // search video for this artist
                promises2.push(youtubeApi.search(artistsRelatedNames[i], artistsVideosNumbers[i], null));
              }
              Promise.all(promises2)
                .then(videosData => {
                  var finalVideosResults = [];
                  videosData.forEach(function (videosObject, index) {
                    videosObject.items.forEach(function (singleVideoObject, index) {
                      // console.log("%j", singleVideoObject.id.videoId)
                      finalVideosResults.push(singleVideoObject);
                    });
                  });
                  resolve(finalVideosResults);
                })
                .catch(error => {
                  // console.log("%j", error);
                  reject(error);
                });
            })
            .catch(error => {
              // console.log("%j", error);
              reject(error);
            });
        } else {
          // no artist founded for this video
          reject({
            "status": "error",
            "message": "no artists founded for this video"
          });
        }
      }).catch(function (error) {
        // console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  bandMembersSimilarity(res, videoId) {
    return new Promise((resolve, reject) => {
      VideosController.getVideoById(videoId).then(function (videoFounded) {
        if (videoFounded != null) {
          var promises = [];
          videoFounded.Artists.forEach(function (artist, index) {
            if (artist.type == "band") {
              promises.push(ArtistsController.getBandsMembersById(artist.id));
            } else {
              reject({
                "status": "error",
                "message": "this artist isn't a band"
              });
            }
          });
          Promise.all(promises)
            .then(artistsFounded => {
              var calculateArtistsAndVideosNumbers = RecommenderHelper.bandMembersSimilarity(artistsFounded);
              var artistsRelatedNames = calculateArtistsAndVideosNumbers.artistsNames;
              var artistsVideosNumbers = calculateArtistsAndVideosNumbers.artistsVideosNumbers;
              var promises2 = [];
              for (var i = 0; i < artistsRelatedNames.length; i++) {
                // search video for this artist
                promises2.push(youtubeApi.search(artistsRelatedNames[i], artistsVideosNumbers[i], null));
              }
              Promise.all(promises2)
                .then(videosData => {
                  var finalVideosResults = [];
                  videosData.forEach(function (videosObject, index) {
                    videosObject.items.forEach(function (singleVideoObject, index) {
                      // console.log("%j", singleVideoObject.id.videoId)
                      finalVideosResults.push(singleVideoObject);
                    });
                  });
                  resolve(finalVideosResults);
                })
                .catch(error => {
                  // console.log("%j", error);
                  reject(error);
                });
            })
            .catch(error => {
              // console.log("%j", error);
              reject(error);
            });
        } else {
          // no artist founded for this video
          reject({
            "status": "error",
            "message": "no artists founded for this video"
          });
        }
      }).catch(function (error) {
        // console.log("%j", error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  genreSimilarity(response, videoId) {
    return new Promise((resolve, reject) => {
      VideosController.getVideoById(videoId).then(function (videoFounded) {
        Video.findAll({
          include: [{
              model: Channel
            },
            {
              model: Artist
            },
            {
              model: Genre,
              where: {
                id: videoFounded.Genre.id
              }
            }
          ],
          where: {
            id: {
              [Op.not]: videoId // exclude current video
            }
          },
          order: Sequelize.literal('rand()'),
          limit: constants.recommenderVideosNumber
        }).then(function (videosWithThisGenre) {
          if (videosWithThisGenre.length < 20) {
            var idArtistsList = [];
            videoFounded.Artists.forEach((artist) => {
              idArtistsList.push(artist.id)
            })
            return Video.findAll({
              include: [{
                  model: Channel
                },
                {
                  model: Artist,
                  where: {
                    id: idArtistsList
                  }
                }
              ],
              where: {
                id: {
                  [Op.not]: videoId // exclude current video
                }
              },
              order: Sequelize.literal('rand()'),
              limit: (constants.recommenderVideosNumber - videosWithThisGenre.length)
            }).then(function (additionalVideos) {
              additionalVideos.forEach((additionalVideo) => {
                videosWithThisGenre.push(additionalVideo);
              })
              resolve(videosWithThisGenre);
            }).catch(function (error) {
              reject(error);
            });
          } else {
            resolve(videosWithThisGenre);
          }
        }).catch(function (error) {
          // console.log("%j", error);
          reject(error);
        });
      }).catch(function (error) {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};

var VideosController = require('./VideosController.js');
var ArtistsController = require('./ArtistsController.js');