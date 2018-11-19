////////////////////////////////////////////////////////////////////////////////
var Promise = require("bluebird");
var TestController = require('../controllers/TestController.js');
var AuthController = require('../controllers/AuthController.js');
var ChannelsController = require('../controllers/ChannelsController.js');
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
}