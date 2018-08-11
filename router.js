////////////////////////////////////////////////////////////////////////////////
var TempPage = require('./scripts/temp/temp.js');
var AjaxLib = require('./libs/AjaxLib.js');
var YoutubeApi = require('./libs/YoutubeApi.js');
////////////////////////////////////////////////////////////////////////////////
const tempView = new TempPage();
const ajaxLib = new AjaxLib();
const youtubeApi = new YoutubeApi();
////////////////////////////////////////////////////////////////////////////////
module.exports = function(app) {
  // main route
  app.get('/', function(request, response) {
    response.send('Progetto TW');
    //response.render('pages/index');
  });
  // route for testing db
  app.get('/db', function(request, response) {
    tempView.visualizzoDatiDiProva(response);
  });
  // api testing route
  app.get('/api', function(request, response) {
    ajaxLib.jsonRequest("https://reqres.in/api/users", "GET", {}, function(result) {
      response.send(result.data);
    });
  });
  // api testing route
  app.get('/youtube', function(request, response) {
    youtubeApi.search("Linkin Park", 10, "", function(result) {
      response.send(result);
    });
  });
  // api testing route
  app.get('/youtube/:id', function(request, response) {
    var id = request.params.id;
    youtubeApi.getById(id, function(result) {
      response.send(result);
    });
  });
};
////////////////////////////////////////////////////////////////////////////////