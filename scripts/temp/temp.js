////////////////////////////////////////////////////////////////////////////////
var mySqlDB = require('../../libs/database/mysql-lib.js');
const database = new mySqlDB();
////////////////////////////////////////////////////////////////////////////////


module.exports = class tempPage {
  constructor() {
    // nothing to do
  }

  visualizzoDatiDiProva(response) {
    if (database.isConnected()) {
      var sql = "SELECT ?? FROM prova";
      database.selectQuery(sql, ["nome"], function(results) {
        response.render('pages/temp/db', {
          data: results.data
        });
      });
    } else {
      response.send("qualcosa non è andato");
    }
  }
};