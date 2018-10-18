////////////////////////////////////////////////////////////////////////////////
var DBpediaController = require('../controllers/DBpediaController.js');
var AjaxRequest = require('../libraries/AjaxRequest.js');
////////////////////////////////////////////////////////////////////////////////
const dbpediaController = new DBpediaController();
const ajaxRequest = new AjaxRequest();
////////////////////////////////////////////////////////////////////////////////
module.exports = function (app, passport) {
  // api testing route
  app.get('/api', function (request, response) {
    ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function (result) {
      response.send(result.data);
    });
  });
  // SPARQL testing route
  app.get('/sparql', function (request, response) {
    dbpediaController.sparql(response);
  });
};
////////////////////////////////////////////////////////////////////////////////