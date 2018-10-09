
// IMPORT MODULE
var express     =   require('express');
var ApiRoutes   =   require('./Routes/Api');
var WebRoutes   =   require('./Routes/Web');
var AuthRoutes  =   require('./Routes/Auth');
var cors        =   require('cors');
var bodyParser  =   require('body-parser');
var passport    =   require('passport');
var session     =   require('express-session');
require("dotenv").config();

// INSTANCE GLOBAL OBJECT
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