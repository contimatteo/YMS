////////////////////////////////////////////////////////////////////////////////

var mySqlDB = require('../Libraries/database/MySql.js');
var YoutubeApi = require('../Libraries/YoutubeApi.js');
var Sparql_Library = require('../Libraries/Sparql.js');
var Promise = require('bluebird');

const database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());
const sparqlClient = new Sparql_Library();

////////////////////////////////////////////////////////////////////////////////

// models
const Artist = require('../Models/Artist.js');
const Band = require('../Models/Band.js');
const Channel = require('../Models/Channel.js');
const Video = require('../Models/Video.js');

////////////////////////////////////////////////////////////////////////////////

// var ApiError = require('../../Libraries/Schemas/ApiError.js');

module.exports = class TestController {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    // nothing to do
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // run db query exaple
  visualizzoDatiDiProva(response) {
    if (database.isConnected()) {
      var sql = "SELECT ?? FROM users";
      database.selectQuery(sql, ["nome"], function (results) {
        response.render('pages/test/db', {
          data: results.data
        });
      });
    } else {
      response.send("qualcosa non è andato");
    }
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // 
  sparql(response) {
    // var query = "  PREFIX dbo: <http://dbpedia.org/ontology/> " +
    //             "  PREFIX dbp: <http://dbpedia.org/resource/> " +
    //             "  PREFIX foaf: <http://xmlns.com/foaf/0.1/> " +
    //             "  SELECT ?bandname where { " +
    //             "    ?person foaf:name ?name . " +
    //             "    ?band dbo:bandMember ?person . " +
    //             //"    ?band dbo:genre ?genre . " +
    //             "    ?band foaf:name ?bandname .  " +
    //             "  } ";
    var query = " PREFIX dbo: <http://dbpedia.org/ontology/>" +
      " PREFIX dbr: <http://dbpedia.org/resource/> " +
      " SELECT ?s WHERE { " +
      " ?s a dbo:City ; " +
      " dbo:country dbr:India " +
      " }";
    sparqlClient.runQuery(query, [], [], function (results) {
      response.send(results);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  visualizzoVideo(response, id) {
    youtubeApi.getById(id).then(function (results) {
      response.render('pages/test/video', {
        videoId: results.items[0].id
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

};