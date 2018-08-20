////////////////////////////////////////////////////////////////////////////////
//                            IMPORT MODULE
var express = require('express');
var router = require('./router');
var cors = require('cors');
require('dotenv').config({
  path: __dirname + '/.env'
});
var bodyParser = require('body-parser');
////////////////////////////////////////////////////////////////////////////////
//                            IMPORT SCHEMA
// const DBResponse = require('./libs/schema/DBResponse.js');
// const ApiResponse = require('./libs/schema/ApiResponse.js');
////////////////////////////////////////////////////////////////////////////////
//                        INSTANCE GLOBAL OBJECT
var app = express();
// project url
// app.use(cors({ origin: 'http://italiancoders.it'}));      
app.use(cors());
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
  extended: true
}));
////////////////////////////////////////////////////////////////////////////////
//                              MIDDLEWARE 1
app.use(function(req, res, next) {
  // console.log("MIDDLEWARE 1 : controllo di sicurezza passatto correttamente");
  next();
});
////////////////////////////////////////////////////////////////////////////////
//                              MIDDLEWARE 2
app.use(function(req, res, next) {
  // console.log("MIDDLEWARE 2 : controllo di sicurezza passatto correttamente");
  next();
});
////////////////////////////////////////////////////////////////////////////////
// set enviroment configuration
app.set('view engine', 'ejs');
app.set('port', (8000 || process.env.PORT || 9000));
app.use(express.static(__dirname + '/public'));
////////////////////////////////////////////////////////////////////////////////
// enable lister
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
  console.log("******************** YMS - Youtube Music Spider [1.0.0] ********************");
  // console.log(process.cwd());
});
////////////////////////////////////////////////////////////////////////////////
// instance custom router module
router(app);
////////////////////////////////////////////////////////////////////////////////