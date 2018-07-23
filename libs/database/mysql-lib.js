/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *        MYSQL LIBRARY
 *
 * author:        Conti Matteo
 * description:   simple library for exchange data with MySql databases.
 * version:       1.0.0
 * git repo:      ...
 * created:       22/07/2018
 * updated:       22/07/2018
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

// IMPORT SQL LIBS
var mysql = require('mysql');

// MAIN CLASS
module.exports = class mySqlDB {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    this.connection = mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE
    });
    this.connectionStatus = "";
    this.connection.connect();
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  connect() {
    this.connection.connect();
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  disconnect() {
    this.connection.end();
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  isConnected() {
    if (this.connection.state === 'disconnected') {
      this.connectionStatus = "disconnected";
      return false;
    } else {
      this.connectionStatus = "connected";
      return true;
    }
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  selectQuery(query, bindValues, result) {
    // preapare the query
    var sqlQuery = mysql.format(query, bindValues);
    // exec the query
    this.connection.query(sqlQuery, function(error, databaseData, fields) {
      if (error) throw error;
      Object.assign(result.data, databaseData);
      console.log('The solution is: ', result.data);
      result.errors = error;
      result.lenght = databaseData.length;
      result.fields = fields;
      Object.assign(result.fields, fields);
      return true;
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
////////////////////////////////////////////////////////////////////////////////