////////////////////////////////////////////////////////////////////////////////
// var Promise = require("bluebird");
var TestController = require('../controllers/TestController.js');
var AuthController = require('../controllers/AuthController.js');
var ChannelsController = require('../controllers/ChannelsController.js');
var RecommenderController = require('../controllers/RecommenderController.js');
var VideosController = require('../controllers/VideosController.js');
////////////////////////////////////////////////////////////////////////////////
// const TestController = Promise.promisifyAll(new TestControllerClass());
////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {

  // orm 1 testing route
  app.get('/orm1', AuthController.userLoggedIn, function (req, res) {
    TestController.orm1(res);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/orm2', AuthController.userLoggedIn, TestController.orm2);
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // orm 3 testing route
  app.get('/orm3', function (req, res) {
    TestController.orm3(res);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // orm 4 testing route
  app.get('/orm4', function (req, res) {
    TestController.orm3(res);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // route for testing db
  app.get('/db', AuthController.userLoggedIn, function (req, res) {
    TestController.visualizzoDatiDiProva(res);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/song/:id', function (req, res) {
    var id = req.params.id;
    TestController.getSongDbpediaInfo(id).then(function(results) {
      res.send(results);
    }).catch(function(error) {
      res.send(error);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}