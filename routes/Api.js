////////////////////////////////////////////////////////////////////////////////
var SparqlController = require('../controllers/SparqlController.js');
var RecommenderController = require('../controllers/RecommenderController.js');
var AjaxRequest = require('../libraries/AjaxRequest.js');
var TestController = require('../controllers/TestController.js');
////////////////////////////////////////////////////////////////////////////////

////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {
  // api testing route
  // app.get('/api', function (req, res) {
  //   ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function (result) {
  //     res.send(result.data);
  //   });
  // });
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
  app.get('/recommender/localView', function (req, res) {
    TestController.localView(res).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/viewsHistory/:user/:video', function (req, res) {
    var videoId = req.params.video;
    var userId = req.params.user;
    RecommenderController.viewsHistory(res, userId, videoId).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/recommender/random', function (req, res) {
    RecommenderController.random(res).then(function (result) {
      res.send(result);
    }).catch(function (error) {
      res.send(error);
    });
  });

};
////////////////////////////////////////////////////////////////////////////////