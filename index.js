// ////////////////////////////////////////////////////////////////////////////////
// //                            IMPORT MODULE
// var express = require('express');
// var router = require('./router');
// var cors = require('cors');
// require('dotenv').config({
//   path: __dirname + '/.env'
// });
// var bodyParser = require('body-parser');
// ////////////////////////////////////////////////////////////////////////////////
// //                            IMPORT SCHEMA
// // ...
// ////////////////////////////////////////////////////////////////////////////////
// //                        INSTANCE GLOBAL OBJECT
// var app = express();
// // project url
// // app.use(cors({ origin: 'http://italiancoders.it'}));      
// app.use(cors());
// app.use(bodyParser.json()); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
//   extended: true
// }));
// ////////////////////////////////////////////////////////////////////////////////
// //                              MIDDLEWARE 1
// app.use(function(req, res, next) {
//   // console.log("MIDDLEWARE 1 : controllo di sicurezza passatto correttamente");
//   next();
// });
// ////////////////////////////////////////////////////////////////////////////////
// //                              MIDDLEWARE 2
// app.use(function(req, res, next) {
//   // console.log("MIDDLEWARE 2 : controllo di sicurezza passatto correttamente");
//   next();
// });
// ////////////////////////////////////////////////////////////////////////////////
// // set enviroment configuration
// app.set('port', (8000 || process.env.PORT || 9000));
// app.use(express.static(__dirname + '/public'));
// app.set('view engine', 'ejs');
// ////////////////////////////////////////////////////////////////////////////////
// // enable lister
// app.listen(app.get('port'), function() {
//   //console.log("Node app is running at localhost:" + app.get('port'));
//   console.log("******************* YMS - Youtube Music Spider [1.0.1] *******************");
//   // console.log(process.cwd());
// });
// ////////////////////////////////////////////////////////////////////////////////
// // instance custom router module
// router(app);
// //////////////////////////////////////////////////////////////////////////////





var express = require('express');
var cors = require('cors');
require('dotenv').config({
  path: __dirname + '/.env'
});
var bodyParser = require('body-parser');

var app = express();
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));

app.use(function(req, res, next) {
  console.log("MIDDLEWARE 1 : controllo di sicurezza passatto correttamente");
  next();
});

app.set('port', (8000 || process.env.PORT || 9000));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');

var TestController = require('./controllers/TestController.js');
var AjaxRequest = require('./Libraries/AjaxRequest.js');
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var testView = new TestController();
var ajaxRequest = new AjaxRequest();

app.get('/', (req, res) => res.send('Main index of project'));
// route for testing db
app.get('/db', function(request, response) {
  testView.visualizzoDatiDiProva(response);
});
// api testing route
app.get('/api', function(request, response) {
  ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function(result) {
    response.send(result.data);
  });
});
// api testing route
app.get('/youtube', function(request, response) {
  testView.ricercaVideo(response, "Ninja", 10);
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

app.listen(8000, () => console.log('Example app listening on port 8000!'));