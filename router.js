// ////////////////////////////////////////////////////////////////////////////////
// var TestController = require('./Controllers/TestController.js');
// var AjaxRequest = require('./Libraries/AjaxRequest.js');
// var AuthController = require('./Controllers/Auth/AuthController.js');
// ////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////
// const testView = new TestController();
// const ajaxRequest = new AjaxRequest();
// ////////////////////////////////////////////////////////////////////////////////
// module.exports = function(app) {
//   // main route
//   app.get('/', function(request, response) {
//     response.send('Progetto TW');
//     //response.render('pages/index');
//   });
//   // route for testing db
//   app.get('/db', function(request, response) {
//     testView.visualizzoDatiDiProva(response);
//   });
//   // api testing route
//   app.get('/api', function(request, response) {
//     ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function(result) {
//       response.send(result.data);
//     });
//   });
//   // api testing route
//   app.get('/youtube', function(request, response) {
//     testView.ricercaVideo(response, "Ninja", 10);
//   });
//   // api testing route
//   app.get('/youtube/:id', function(request, response) {
//     var id = request.params.id;
//     testView.visualizzoVideo(response, id);
//   });
//   // SPARQL testing route
//   app.get('/sparql', function(request, response) {
//     testView.sparql(response);
//   });
//   // orm 1 testing route
//   app.get('/orm1', function(request, response) {
//     testView.orm1(response);
//   });
//   // orm 2 testing route
//   app.get('/orm2', function(request, response) {
//     testView.orm2(response);
//   });
//   // orm 3 testing route
//   app.get('/orm3', function(request, response) {
//     testView.orm3(response);
//   });
//   // orm 4 testing route
//   app.get('/orm4', function(request, response) {
//     testView.orm3(response);
//   });

//   // passport
//   app.get('/signup', authController.signup);
// };
// ////////////////////////////////////////////////////////////////////////////////