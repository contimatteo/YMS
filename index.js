var express = require('express');
var cors = require('cors');
require('dotenv').config({
  path: __dirname + '/.env'
});
var bodyParser = require('body-parser');
var passport    =   require('passport');
var session     =   require('express-session');
////////////////////////////////////////////////////////////////////////////////
// INSTANCE GLOBAL OBJECT
var app = express();
// app.use(cors({ origin: 'http://italiancoders.it'}));   // project url
app.use(cors());
var path = require('path');
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
////////////////////////////////////////////////////////////////////////////////
// PASSPORT
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
require('./Libraries/Passport.js')(passport);
////////////////////////////////////////////////////////////////////////////////
// set enviroment configuration
app.set('port', (8000 || process.env.PORT || 9000));
app.use(express.static(__dirname + '/static'));
 app.set('views', '/webapp/views');
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
////////////////////////////////////////////////////////////////////////////////
var TestController = require('./Controllers/TestController.js');
var AjaxRequest = require('./Libraries/AjaxRequest.js');
var testView = new TestController();
var ajaxRequest = new AjaxRequest();

app.get('/', function(request, response) {
  response.render('dashboard');
});
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

////////////////////////////////////////////////////////////////////////////////
// PASSPORT
require('./Libraries/Passport.js')(passport);
////////////////////////////////////////////////////////////////////////////////
// LISTENER
app.listen(app.get('port'), function() {
  console.log("••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••");
  console.log("••••••••••••••••• YOUTUBE MUSIC SPIDER ["+app.get('port')+"] •••••••••••••••••");
  console.log("••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••");
});

////////////////////////////////////////////////////////////////////////////////
