////////////////////////////////////////////////////////////////////////////////
var Promise = require("bluebird");
var TestController = require('../controllers/TestController.js');
var AuthController = require('../controllers/AuthController.js');
var ChannelsController = require('../controllers/ChannelsController.js');
var RecommenderController = require('../controllers/RecommenderController.js');
var VideosController = require('../controllers/VideosController.js');
var JsonAPI = require('../libraries/schemas/JsonAPI.js')
////////////////////////////////////////////////////////////////////////////////
// const TestController = Promise.promisifyAll(new TestControllerClass());
////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {

  // orm 1 testing route
  app.get('/orm1', AuthController.userLoggedIn, function (request, response) {
    TestController.orm1(response);
  });

  app.get('/orm2', AuthController.userLoggedIn, TestController.orm2);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // orm 3 testing route
  app.get('/orm3', function (request, response) {
    TestController.orm3(response);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // orm 4 testing route
  app.get('/orm4', function (request, response) {
    TestController.orm3(response);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // route for testing db
  app.get('/db', AuthController.userLoggedIn, function (request, response) {
    TestController.visualizzoDatiDiProva(response);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/enri', function (request, response) {
    TestController.initializeName(response);
  });

  app.get('/channels/:id', function (request, response) {
    var youtubeId = request.params.id;
    ChannelsController.findOrCreateChannel(youtubeId, "matteo").then(function (result) {
      response.send(result);
    }).catch(function (error) {
      response.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/aboutUs', function (req, res) {
    res.render('pages/aboutUs/aboutUs')
  });
    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/globpop', function(req, res){
    var id = req.query.id       //mi prende l id del video, che mi passa chi vuole il json
    var url = "/recommender/random/";
    if(id != null){
      RecommenderController.random(null).then(function (result) {
        VideosController.getVideoByYoutubeId(id).then(function(videoFinded){
          var lastWatched = "";
          var site = "site1834.tw.cs.unibo.it";
          var reccomended = [];
          res.send(videoFinded);
        })
      }).catch(function (error) {
        // TODO: return empty json
         res.send(error);
      });
      //  AjaxRequest.jsonRequest(url, 'GET', {}).then(function (vitaliResponse) {
      //   var promises = [];
      //   vitaliResponse.recommended.forEach(video => {
      //     promises.push(VideosController._getVideoInfo(null, video.videoID));
      //   });
      //   Promise.all(promises)
      //     .then(videosData => {
      //       resolve(videosData);
      //     })
      //     .catch(error => {
      //       console.log("%j", error);
      //       resolve(null);
      //     });
      // }).catch((error) => {
      //   console.log("%j", error);
      //   resolve(null);
      // });
    }
    else {
      // no video founded
      res.send({message: "no video"})
    }
  })
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}
