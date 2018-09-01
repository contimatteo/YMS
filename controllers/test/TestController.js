////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
var mySqlDB = require('../../Libraries/database/MySql.js');
var YoutubeApi = require('../../Libraries/YoutubeApi.js');
var Sparql_Library = require('../../Libraries/Sparql.js');

const database = new mySqlDB();
const youtubeApi = new YoutubeApi()
const sparqlClient = new Sparql_Library();


const Pippo = require('../../Models/Pippo.js');
const Prova = require('../../Models/Prova.js');

// const Pippo = require('../../ORM/Models/pippos.js')(ORM.sequelize, Sequelize.DataTypes);;
// const Prova = require('../../ORM/Models/provas.js')(ORM.sequelize, Sequelize.DataTypes);;
////////////////////////////////////////////////////////////////////////////////


module.exports = class TestController {

  constructor() {
    // nothing to do
  }

  // run db query exaple
  visualizzoDatiDiProva(response) {
    if (database.isConnected()) {
      var sql = "SELECT ?? FROM provas";
      database.selectQuery(sql, ["nome"], function(results) {
        response.render('pages/test/db', {
          data: results.data
        });
      });
    } else {
      response.send("qualcosa non è andato");
    }
  }

  // show video by id
  visualizzoVideo(response, id) {
    youtubeApi.getById(id, function(results) {
      response.render('pages/test/video', {
        videoId: results.items[0].id
      });
      // response.send(results);
    });
  }

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
    sparqlClient.runQuery(query, [], [], function(results) {
      response.send(results);
    });
  }

  // 
  ricercaVideo(response, searchString, numberResult) {
    youtubeApi.search(searchString, numberResult, function(results) {
      response.render('pages/test/listVIdeo', {
        data: results.items
      });
      // response.render('utilities/viewJson', {
      //   json: JSON.stringify(result.items)
      // });
    });
  }

  // ORM
  orm(response) {
    Pippo.findAll({
      include: [{
        model: Prova,
        as: 'AliasForProvaRelation'
      }]
    }).then(users => {
        response.send(users);
      });
  }
  
};
////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////
