////////////////////////////////////////////////////////////////////////////////
var TestController = require('../controllers/TestController.js');
var AjaxRequest = require('../libraries/AjaxRequest.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////
const testController = new TestController();
const ajaxRequest = new AjaxRequest();
////////////////////////////////////////////////////////////////////////////////
module.exports = function(app, passport) {
  // main route
  app.get('/', function(request, response) {
    response.send('Progetto TW');
    //response.render('pages/index');
  });
  // route for testing db
  app.get('/db', AuthController.userLoggedIn, function(request, response) {
    testController.visualizzoDatiDiProva(response);
  });
  // api testing route
  app.get('/api', function(request, response) {
    ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function(result) {
      response.send(result.data);
    });
  });
  // api testing route
  app.get('/youtube', AuthController.userLoggedIn, function(request, response) {
    testController.ricercaVideo(response, "Linkin Park", 5);
  });
  // api testing route
  app.get('/youtube/:id', AuthController.userLoggedIn, function(request, response) {
    var id = request.params.id;
    testController.visualizzoVideo(response, id);
  });
  // SPARQL testing route
  app.get('/sparql', function(request, response) {
    testController.sparql(response);
  });
  // orm 1 testing route
  app.get('/orm1', AuthController.userLoggedIn, function(request, response) {
    testController.orm1(response);
  });
  // orm 2 testing route
  // app.get('/orm2', function(request, response) {
  //   testController.orm2(response);
  // });
  app.get('/orm2', AuthController.userLoggedIn, testController.orm2);
  // orm 3 testing route
  app.get('/orm3', function(request, response) {
    testController.orm3(response);
  });
  // orm 4 testing route
  app.get('/orm4', function(request, response) {
    testController.orm3(response);
  });
  // enri testing views
  app.get('/enri/view/index', function(request, response) {
    testController.viewIndex(response);
  });
};
////////////////////////////////////////////////////////////////////////////////