////////////////////////////////////////////////////////////////////////////////
var SparqlController = require('../controllers/SparqlController.js');
var AjaxRequest = require('../libraries/AjaxRequest.js');
var TestControllerClass = require('../controllers/TestController.js');
////////////////////////////////////////////////////////////////////////////////
const ajaxRequest = new AjaxRequest();
////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {
  // api testing route
  app.get('/api', function (request, response) {
    ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function (result) {
      response.send(result.data);
    });
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // SPARQL testing route
  app.get('/sparql', function (request, response) {
    SparqlController.sparql(response);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  app.get('/vitali/:id', function (req, res) {
    var id = req.params.id;
    TestController.fvitaliVideoRequest(res, id);
  });
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
////////////////////////////////////////////////////////////////////////////////