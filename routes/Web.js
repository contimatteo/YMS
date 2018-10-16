////////////////////////////////////////////////////////////////////////////////
var TestController = require('../controllers/TestController.js');
var AuthController = require('../controllers/AuthController.js');
////////////////////////////////////////////////////////////////////////////////
const testController = new TestController();
////////////////////////////////////////////////////////////////////////////////
module.exports = function(app, passport) {
  // main route
  app.get('/', function(request, response) {
    // response.send('Progetto TW');
    // testController.viewIndex(response);
    testController.ricercaVideoHome(response, "Linkin Park", 5);
    //response.render('pages/home/home');
  });
  // route for testing db
  app.get('/db', AuthController.userLoggedIn, function(request, response) {
    testController.visualizzoDatiDiProva(response);
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
};
////////////////////////////////////////////////////////////////////////////////