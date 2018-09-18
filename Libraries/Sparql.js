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
  runQuery(query, bindingNames, bindingValues, nextFunction) {
    // set the query
    this.client.query(query);
    // prepare the query
    for (var i = 0; i < bindingNames.length; i++) {
      // this.client.bind(bindingNames[i], {
      //   db: 'Vienna'
      // });
      //console.log("bind " + bindingNames[i] + " --> " + bindingValues[i].dbp);
      this.client.query(query).bind(bindingNames[i], bindingValues[i]);
    }
    // execute the query
    this.client.query(query).execute(function(error, results) {
      // console.dir(arguments, {
      //   depth: null
      // });
      if (!error) {
        nextFunction(results);
      } else {
        nextFunction(null);
      }
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
