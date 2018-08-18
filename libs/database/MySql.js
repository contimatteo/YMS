/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *          MYSQL LIBRARY
 *
 *  author:        Conti Matteo
 *  description:   simple library for exchange data with MySql databases.
 *  version:       1.0.0
 *  git repo:      ...
 *  created:       22/07/2018
 *  updated:       22/07/2018
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */
////////////////////////////////////////////////////////////////////////////////
// IMPORT SQL LIBS
var mysql = require('mysql');
// IMPORT SCHEMA
const DBResponse = require('../../libs/schema/DBResponse.js');
const ApiResponse = require('../../libs/schema/ApiResponse.js');
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
  // SELECT methods
  selectQuery(query, bindValues, nextCallback) {
    // preapare the query
    var sqlQuery = mysql.format(query, bindValues);
    // exec the query
    this.connection.query(sqlQuery, function(error, dbData, fields) {
      // thrown errors
      if (error) throw error;
      // set result
      var result = new DBResponse();
      result.isExecuted = true;
      result.lenght = dbData.length;
      var resultData = [];
      for (var index in dbData) {
        resultData.push(dbData[index]);
      }
      Object.assign(result.data, resultData);
      Object.assign(result.fields, fields);
      Object.assign(result.errors, error);
      // return value
      nextCallback(result);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // INSERT, DELETE, UPDATE method
  standardQuery(query, bindValues, nextCallback) {
    // preapare the query
    var sqlQuery = mysql.format(query, bindValues);
    // exec the query
    this.connection.query(sqlQuery, function(error, databaseData, fields) {
      // thrown errors
      if (error) throw error;
      // set result
      var result = new DBResponse();
      result.lenght = 0;
      result.isExecuted = true;
      Object.assign(result.data, {});
      Object.assign(result.fields, fields);
      Object.assign(result.errors, error);
      // return value
      nextCallback(result);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
////////////////////////////////////////////////////////////////////////////////