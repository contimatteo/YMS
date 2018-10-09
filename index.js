
// var express = require('express');
// var cors = require('cors');
// var env         =   require('dotenv').load();
// var bodyParser  =   require('body-parser');
// var passport    =   require('passport');
// var session     =   require('express-session');

// // INSTANCE GLOBAL OBJECT
// var app = express();
// app.use(cors());
// app.use(bodyParser.json()); // to support JSON-encoded bodies
// app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
//   extended: true
// }));

// app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
// app.use(passport.initialize());
// app.use(passport.session()); // persistent login sessions
// require('./Libraries/Passport.js')(passport);

// // set enviroment configuration
// app.set('port', (8000 || process.env.PORT || 9000));
// app.use(express.static(__dirname + '/static'));
// // app.set('views', __dirname + '/views');
// app.set('view engine', 'ejs');

// var TestController = require('./Controllers/TestController.js');
// var AjaxRequest = require('./Libraries/AjaxRequest.js');
// ////////////////////////////////////////////////////////////////////////////////
// ////////////////////////////////////////////////////////////////////////////////
// var testView = new TestController();
// var ajaxRequest = new AjaxRequest();

// app.get('/', (req, res) => res.send('Main index of project ~ ~ ~ ['+  __dirname + '/views' +']'));

// // // route for testing db
// // app.get('/db', function(request, response) {
// //   testView.visualizzoDatiDiProva(response);
// // });
// // // api testing route
// // app.get('/api', function(request, response) {
// //   ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function(result) {
// //     response.send(result.data);
// //   });
// // });
// // // api testing route
// // app.get('/youtube', function(request, response) {
// //   // testView.ricercaVideo(response, "Metaliica", 5);
// //   response.render('dashboard');
// // });
// // // api testing route
// // app.get('/youtube/:id', function(request, response) {
// //   var id = request.params.id;
// //   testView.visualizzoVideo(response, id);
// // });
// // // SPARQL testing route
// // app.get('/sparql', function(request, response) {
// //   testView.sparql(response);
// // });

// // // PASSPORT
// // require('./Libraries/Passport.js')(passport);

// app.listen(8000, () => console.log('Example app listening on port 8000.'));


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

var TestController = require('./Controllers/TestController.js');
var AjaxRequest = require('./Libraries/AjaxRequest.js');
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var testView = new TestController();
var ajaxRequest = new AjaxRequest();

app.get('/', (req, res) => res.send('Main index of project [' + __dirname +']'));
app.get('/diri', (req, res) => res.render('/dashboard'));
// // route for testing db
// app.get('/db', function(request, response) {
//   testView.visualizzoDatiDiProva(response);
// });
// // api testing route
// app.get('/api', function(request, response) {
//   ajaxRequest.jsonRequest("https://reqres.in/api/users", "GET", {}, function(result) {
//     response.send(result.data);
//   });
// });
// // api testing route
// app.get('/youtube', function(request, response) {
//   testView.ricercaVideo(response, "Ninja", 10);
// });
// // api testing route
// app.get('/youtube/:id', function(request, response) {
//   var id = request.params.id;
//   testView.visualizzoVideo(response, id);
// });
// // SPARQL testing route
// app.get('/sparql', function(request, response) {
//   testView.sparql(response);
// });

app.listen(8000, () => console.log('Example app listening on port 8000!'));