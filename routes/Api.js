////////////////////////////////////////////////////////////////////////////////
var SparqlController = require('../controllers/SparqlController.js');
var RecommenderController = require('../controllers/RecommenderController.js');
var AjaxRequest = require('../libraries/AjaxRequest.js');
var TestController = require('../controllers/TestController.js');
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/vitali/:id', function (req, res) {
    var id = req.params.id;
    RecommenderController.vitali(id).then(function (result) {
        res.send(result);
      })
      .catch(function (error) {
        res.send(error);
      });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/popularity/local/absolute', function (req, res) {
    TestController.localView(res).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/popularity/local/relative/:user/:video', function (req, res) {
    var videoId = req.params.video;
    var userId = req.params.user;
    RecommenderController.localRelativePopularity(res, userId, videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/random', function (req, res) {
    RecommenderController.random(null).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.send(error);
    });
  });

  app.get('/recommender/recent/:user', function (req, res) {
    var userId = req.params.user;
    RecommenderController.recent(res,userId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.send(error);
    });
  });

};
////////////////////////////////////////////////////////////////////////////////
