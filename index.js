////////////////////////////////////////////////////////////////////////////////
//                            IMPORT MODULE
// import express
var express = require('express');
// import cors
var cors = require('cors');
// import dotenv
require('dotenv').config({
  path: __dirname + '/.env'
});
// import mySql lib
const mySqlDB = require('./libs/database/mysql-lib.js');
////////////////////////////////////////////////////////////////////////////////
//                            IMPORT SCHEMA
const DBResponse = require('./libs/schema/DBresponse.js');
////////////////////////////////////////////////////////////////////////////////
//                        INSTANCE GLOBAL OBJECT
// instance express
var app = express();
// enable cors (allow all origin)
// app.use(cors({ origin: 'http://italiancoders.it'}));      // project url
app.use(cors());
// instance mysql Database object
const database = new mySqlDB();
////////////////////////////////////////////////////////////////////////////////
//                              MIDDLEWARE
app.use(function(req, res, next) {
  // console.log('Timestamp:', Date.now());
  next();
});
////////////////////////////////////////////////////////////////////////////////
// set env config
app.set('port', (process.env.PORT || 9000));
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'ejs');
////////////////////////////////////////////////////////////////////////////////
// main route
app.get('/', function(request, response) {
  //response.send('Progetto TW');
  response.render('pages/index');
});
// route for testing db
app.get('/db', function(request, response) {
  if (database.isConnected()) {
    var sql = "SELECT ?? FROM prova";
    database.selectQuery(sql, ["nome"], function(result) {
      response.send(result.data);
    });
  } else {
    response.send(database.connectionStatus);
  }
});
////////////////////////////////////////////////////////////////////////////////
// enable lister
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'));
});
////////////////////////////////////////////////////////////////////////////////