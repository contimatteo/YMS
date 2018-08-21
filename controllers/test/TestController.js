////////////////////////////////////////////////////////////////////////////////
var mySqlDB = require('../../libs/database/MySql.js');
var YoutubeApi = require('../../libs/YoutubeApi.js');
var Sparql_Library = require('../../libs/Sparql.js');
const database = new mySqlDB();
const youtubeApi = new YoutubeApi()
const sparqlClient = new Sparql_Library();
////////////////////////////////////////////////////////////////////////////////


module.exports = class TestController {
  constructor() {
    // nothing to do
  }
  //////////////////////////////////////////////////////////////////////////////
  visualizzoDatiDiProva(response) {
    if (database.isConnected()) {
      var sql = "SELECT ?? FROM prova";
      database.selectQuery(sql, ["nome"], function(results) {
        response.render('pages/test/db', {
          data: results.data
        });
      });
    } else {
      response.send("qualcosa non è andato");
    }
  }
  //////////////////////////////////////////////////////////////////////////////
  visualizzoVideo(response, id) {
    youtubeApi.getById(id, function(results) {
      response.render('pages/test/video', {
        videoId: results.items[0].id
      });
      // response.send(results.items[0]);
    });
  }
  //////////////////////////////////////////////////////////////////////////////
  sparql(response) {
    var query = "";
    sparqlClient.runQuery(query, [], [], function(results) {
      response.send(results);
    });
  }
  //////////////////////////////////////////////////////////////////////////////
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
  //////////////////////////////////////////////////////////////////////////////
};