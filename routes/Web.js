////////////////////////////////////////////////////////////////////////////////
var SearchControllerClass = require('../controllers/SearchController.js');
var TestControllerClass = require('../controllers/TestController.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////
const SearchController = new SearchControllerClass();
const TestController = new TestControllerClass();
////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {
  // main route
  app.get('/', function (request, response) {
    response.render('pages/home/home');
  });

  // route for testing db
  app.get('/db', AuthController.userLoggedIn, function (request, response) {
    TestController.visualizzoDatiDiProva(response);
  });

  // search page route
  app.get('/search', function (request, response) {
    // response.render('pages/search/search');
    SearchController.ricercaVideo(response, "Hello cover", 10);
  });

  // api testing route
  app.get('/video/:id', AuthController.userLoggedIn, function (request, response) {
    var id = request.params.id;
    SearchController.visualizzoVideo(response, id);
  });

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
};
////////////////////////////////////////////////////////////////////////////////