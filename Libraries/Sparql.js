/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *          SPARQL LIBRARY
 *
 *  author:        Conti Matteo
 *  description:   simple library for run sparql query on endpoint.
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

const SparqlClient = require('sparql-client-2');
const SPARQL = SparqlClient.SPARQL;
const endpoint = 'http://dbpedia.org/sparql';
const defaultLimit = 1000;
var CustomError = require('./schemas/CustomError.js');

////////////////////////////////////////////////////////////////////////////////

module.exports = class Sparql_Library {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    this.client = new SparqlClient(endpoint)
      .registerCommon('rdfs', 'xsd', 'fn')
      .register({
        db: 'http://dbpedia.org/resource/'
      })
      .register({
        dbpedia: 'http://dbpedia.org/property/'
      });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  runQuery(query, bindingNames, bindingValues) {
    // // set the query
    // this.client.query(query);
    // // prepare the query
    // for (var i = 0; i < bindingNames.length; i++) {
    //   this.client.query(query).bind(bindingNames[i], bindingValues[i]);
    // }
    // // execute the query
    // this.client.query(query).execute(function(error, results) {
    //   if (!error) {
    //     nextFunction(results);
    //   } else {
    //     nextFunction(null);
    //   }
    // });

    return new Promise((resolve, reject) => {
      this.client.query(query);
      // prepare the query
      for (var i = 0; i < bindingNames.length; i++) {
        this.client.query(query).bind(bindingNames[i], bindingValues[i]);
      }
      // execute the query
      this.client.query(query).execute(function (error, results) {
        if (!error) {
          resolve(results);
        } else {
            reject(error);
        }
      });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};