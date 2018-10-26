////////////////////////////////////////////////////////////////////////////////
var TestControllerClass = require('../controllers/TestController.js');
var DataControllerClass = require('../controllers/DataController.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////
const TestController = new TestControllerClass();
const DataController = new DataControllerClass();
////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {

  // orm 1 testing route
  app.get('/orm1', AuthController.userLoggedIn, function (request, response) {
    TestController.orm1(response);
  });

  // orm 2 testing route
  // app.get('/orm2', function(request, response) {
  //   TestController.orm2(response);
  // });
  app.get('/orm2', AuthController.userLoggedIn, TestController.orm2);

  // orm 3 testing route
  app.get('/orm3', function (request, response) {
    TestController.orm3(response);
  });
  
  // orm 4 testing route
  app.get('/orm4', function (request, response) {
    TestController.orm3(response);
  });

  // route for testing db
  app.get('/db', AuthController.userLoggedIn, function (request, response) {
    TestController.visualizzoDatiDiProva(response);
  });

  // route for testing db
  app.get('/import/artist/:name', function (request, response) {
    var name = request.params.name;
    var result = DataController.createArtist(name);
    response.send(result);
  });

};