// /* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  *
//  *          MYSQL LIBRARY
//  *
//  *  author:        Conti Matteo
//  *  description:   simple library for exchange data with MySql databases.
//  *  version:       1.0.0
//  *  git repo:      ...
//  *  created:       22/07/2018
//  *  updated:       22/07/2018
//  *
//  *
//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
//  */

// ////////////////////////////////////////////////////////////////////////////////

// // IMPORT SQL libraries
// require('dotenv').config({
//   path: __dirname + '/.env'
// });
// var mysql = require('mysql');

// // IMPORT SCHEMA
// const DBResponse = require('../../libraries/schemas/DBResponse.js');
// const ApiResponse = require('../../libraries/schemas/ApiResponse.js');
// var CustomError = require('../schemas/CustomError.js');

// ////////////////////////////////////////////////////////////////////////////////

// // MAIN CLASS
// module.exports = class mySqlDB {
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//   constructor() {
//     if (process.env.NODE && ~process.env.NODE.indexOf("heroku")) {
//       this.connection = mysql.createConnection({
//         host: process.env.MYSQL_DB_HOST,
//         user: process.env.MYSQL_DB_USER,
//         password: process.env.MYSQL_DB_PASSWORD,
//         database: process.env.MYSQL_DB_DATABASE,
//         port: 3306
//       });
//     } else {
//       // LOCAL
//       this.connection = mysql.createConnection({
//         host: process.env.DB_HOST,
//         user: process.env.DB_USER,
//         password: process.env.DB_PASSWORD,
//         database: process.env.DB_DATABASE,
//         port: 3306
//       });
//     }
//     this.connectionStatus = "";
//     this.connection.connect();
//   }
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//   connect() {
//     this.connection.connect();
//   }
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//   disconnect() {
//     this.connection.end();
//   }
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//   isConnected() {
//     if (this.connection.state === 'disconnected') {
//       this.connectionStatus = "disconnected";
//       return false;
//     } else {
//       this.connectionStatus = "connected";
//       return true;
//     }
//   }
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//   // SELECT methods
//   selectQuery(query, bindValues) {
//     // preapare the query
//     var sqlQuery = mysql.format(query, bindValues);
//     return new Promise((resolve, reject) => {
//       this.connection.query(sqlQuery, function (error, databaseData, fields) {
//         // thrown errors
//         if (error)
//           reject(error);
//         // thrown no data finded
//         if (!databaseData || !databaseData.length || databaseData.length < 0)
//           reject(new CustomError(400, "no data found", "warning: no fields matched with this query"));
//         // set result
//         var result = new DBResponse();
//         result.isExecuted = true;
//         // result.length = databaseData.length;
//         var resultData = [];
//         for (var index in databaseData) {
//           resultData.push(databaseData[index]);
//         }
//         Object.assign(result.data, resultData);
//         Object.assign(result.fields, fields);
//         Object.assign(result.errors, error);
//         // return value
//         resolve(result);
//       });
//     });
//   }
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
//   // INSERT, DELETE, UPDATE method
//   standardQuery(query, bindValues, nextFunction) {
//     // preapare the query
//     var sqlQuery = mysql.format(query, bindValues);
//     return new Promise((resolve, reject) => {
//       // exec the query
//       this.connection.query(sqlQuery, function (error, databaseData, fields) {
//         // thrown errors
//         if (error)
//           reject(error);
//         // thrown no data finded
//         if (!databaseData || !databaseData.length || databaseData.length < 1)
//           reject(new CustomError(400, "no data found", ""));
//         // set result
//         var result = new DBResponse();
//         result.lenght = 0;
//         result.isExecuted = true;
//         Object.assign(result.data, {});
//         Object.assign(result.fields, fields);
//         Object.assign(result.errors, error);
//         // return value
//         resolve(result);
//       });
//     });
//   }
//   // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// };
// ////////////////////////////////////////////////////////////////////////////////