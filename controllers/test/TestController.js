////////////////////////////////////////////////////////////////////////////////
var mySqlDB = require('../../libs/database/mysql-lib.js');
var YoutubeApi = require('../../libs/YoutubeApi.js');
const database = new mySqlDB();
const youtubeApi = new YoutubeApi();
////////////////////////////////////////////////////////////////////////////////


module.exports = class TestController {
  constructor() {
    // nothing to do
  }

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

  visualizzoVideo(response, id) {
    youtubeApi.getById(id, function(result) {
      // response.render('pages/test/video', {
      //   videoId: result.items[0].id
      // });
      response.send(result.items[0]);
    });
  }

  ricercaVideo(response, searchString, numberResult, optionalFIlter) {
    youtubeApi.search(searchString, numberResult, optionalFIlter, function(result) {
      response.render('pages/test/listVIdeo', {
        data: result.items
      });
      // response.render('utilities/viewJson', {
      //   json: JSON.stringify(result.items)
      // });
    });
  }
};