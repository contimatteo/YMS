////////////////////////////////////////////////////////////////////////////////

// var mySqlDB = require('../libraries/database/MySql.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var Sparql_Library = require('../libraries/Sparql.js');
var Promise = require('bluebird');

// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());
const sparqlClient = new Sparql_Library();

////////////////////////////////////////////////////////////////////////////////

// models
const Artist = require('../models/Artist.js');
const Band = require('../models/Band.js');
const Channel = require('../models/Channel.js');
const Video = require('../models/Video.js');
const User = require('../models/User.js');

////////////////////////////////////////////////////////////////////////////////

// var ApiError = require('../../libraries/schemas/ApiError.js');

module.exports = class TestController {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    // nothing to do
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // run db query exaple
  visualizzoDatiDiProva(response) {
      User.findAll({})
        .then(results => {
          // response.send(results);
          response.render('pages/test/db', {
            data: results
          });
        });
      // var sql = ' SELECT * FROM Users ';
      // database.selectQuery(sql, []).then(function (results) {
      //     response.render('pages/test/db', {
      //       data: results.data
      //     });
      //   })
      //   .catch(function (error) {
      //     if (error.reasonPhrase)
      //       // my custom error
      //       response.send(error.reasonPhrase);
      //     else
      //       // mysql error
      //       response.send(error.sqlMessage);
      //   });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  visualizzoVideo(response, id) {
    youtubeApi.getVideoById(id).then(function (results) {
      response.render('pages/test/video', {
        video: results.items[0]
      });
    }).catch(function (error) {
      response.send(error.reasonPhrase);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show list of videos
  ricercaVideo(response, searchString, numberResult) {
    youtubeApi.search(searchString, numberResult).then(function (results) {
      response.render('pages/test/listVideo', {
        data: results.items
      });  
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all bands with relative artists
  orm1(response) {
    Band.findAll({
        include: [{
          model: Artist
        }]
      })
      .then(results => {
        response.send(results);
      });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all artists with relative bands
  orm2(request, response, next) {
    Artist.findAll({
      include: [{
        model: Band
      }]
    }).then(results => {
      response.send(results);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all videos with his single channel
  orm3(response) {
    Video.findAll({
      include: [{
        model: Channel
      }]
    }).then(results => {
      response.send(results);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all channels with all of linked videos
  orm4(response) {
    Channel.findAll({
      include: [{
        model: Video
      }]
    }).then(results => {
      response.send(results);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // view tester for @enricofabbri
  viewIndex(response) {
    response.render('pages/home/index', {
      data: [
              {"nome": "Matteo", "cognome": "Conti"},
              {"nome": "Enrico", "cognome": "Fabbri"},
              {"nome": "Dario", "cognome": "Campomori"}
            ]
    });
  }

};