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
      var sql = ' SELECT email FROM Users ';
      database.selectQuery(sql, []).then(function (results) {
        response.render('pages/test/db', {
          data: results.data
        });
      })
      .catch(function (error) {
        if(error.reasonPhrase)
          // my custom error
          response.send(error.reasonPhrase);
        else
          // mysql error
          response.send(error.sqlMessage);
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
    // var query = " PREFIX dbo: <http://dbpedia.org/ontology/>" +
    //   " PREFIX dbr: <http://dbpedia.org/resource/> " +
    //   " SELECT ?singer ?wife  " +
    //   " WHERE {  " +
    //   " ?x dbo:musicalArtist ?singer.  " +
    //   " ?singer dbo:spouse ?wife.  " +
    //   " ?wife a dbo:MusicalArtist " +
    //   " } ";
    // var query = " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " + 
    // " PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> " + 
    // " PREFIX owl: <http://www.w3.org/2002/07/owl#> " + 
    // " select (?artist) { " +
    // "  ?artist a dbo:MusicalArtist; " +
    // "           rdfs:label ?name_ . " +
    // " } ";
    // var query = " PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> " +
    //   " PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
    //   " SELECT distinct * WHERE { " +
    //   " ?album a dbpedia-owl:Album.  " +
    //   " Filter( ?album=dbpedia:Hybrid_Theory)  " +
    //   " } ";
    var query = " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
      " PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> " +
      " PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
      "SELECT distinct * " +
      " WHERE { " +
      " ?album a dbpedia-owl:Album . " +
      " ?album rdfs:label ?albumName. " +
      "  ?album dbpedia-owl:artist ?Artist. " +
      " }";
    sparqlClient.runQuery(query, [], []).then(function (results) {
      response.send(results);
    }).catch(function (error) {
      response.send(error.reasonPhrase);
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