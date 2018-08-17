////////////////////////////////////////////////////////////////////////////////
var TestController = require('./controllers/test/TestController.js');
var AjaxLib = require('./libs/AjaxLib.js');

////////////////////////////////////////////////////////////////////////////////
const testView = new TestController();
const ajaxLib = new AjaxLib();

////////////////////////////////////////////////////////////////////////////////
module.exports = function(app) {
  // main route
  app.get('/', function(request, response) {
    response.send('Progetto TW');
    //response.render('pages/index');
  });
  // route for testing db
  app.get('/db', function(request, response) {
    testView.visualizzoDatiDiProva(response);
  });
  // api testing route
  app.get('/api', function(request, response) {
    ajaxLib.jsonRequest("https://reqres.in/api/users", "GET", {}, function(result) {
      response.send(result.data);
    });
  });
  // api testing route
  app.get('/youtube', function(request, response) {
    testView.ricercaVideo(response, "Linkin Park", 10, "");
  });
  // api testing route
  app.get('/youtube/:id', function(request, response) {
    var id = request.params.id;
    testView.visualizzoVideo(response, id);
  });
  // SPARQL testing route
  app.get('/sparql', function(request, response) {
    testView.sparql(response);
  });
};
////////////////////////////////////////////////////////////////////////////////