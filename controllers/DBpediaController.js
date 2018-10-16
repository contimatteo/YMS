////////////////////////////////////////////////////////////////////////////////

var Sparql_Library = require('../libraries/Sparql.js');
const sparqlClient = new Sparql_Library();

////////////////////////////////////////////////////////////////////////////////

// var ApiError = require('../../libraries/schemas/ApiError.js');

module.exports = class TestController {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    // nothing to do
  }

  // 
  sparql(response) {
    /////////////////////////////////////////////////////////////////////////////////
    // da capire cosa fa
    // var query = " PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#> " +
    //   " PREFIX dbpedia-owl:<http://dbpedia.org/ontology/> " +
    //   " PREFIX owl: <http://www.w3.org/2002/07/owl#> " +
    //   "SELECT distinct * " +
    //   " WHERE { " +
    //   " ?album a dbpedia-owl:Album . " +
    //   " ?album rdfs:label ?albumName. " +
    //   "  ?album dbpedia-owl:artist ?Artist. " +
    //   " }";
    /////////////////////////////////////////////////////////////////////////////////
    // 100 album with genre and artist
    // var query = " \
    //   prefix dbpedia:<http://dbpedia.org/> \
    //   prefix dbo:<http://dbpedia.org/ontology/>  \
    //   prefix dbp:<http://dbpedia.org/property/>  \
    //   prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#>  \
    //   SELECT distinct * \
    //   WHERE {  \
    //       ?album a dbo:Album .  \
    //       ?album rdfs:label ?albumName.  \
    //       ?album dbo:artist ?Artist.  \
    //     }  \
    //     Optional{ \
    //               ?album dbo:genre ?genre. \
    //             } \
    //   GROUP BY ?album \
    //   LIMIT 100 \
    // ";
    /////////////////////////////////////////////////////////////////////////////////
    // 100 music genre
    // prefix dbpedia:<http://dbpedia.org/>
    // prefix dbo:<http://dbpedia.org/ontology/> 
    // prefix dbp:<http://dbpedia.org/property/> 
    // prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
    // SELECT distinct *
    // WHERE {
    //     ?genre a dbo:Genre.
    // }
    // GROUP BY ?genre
    // LIMIT 100
    /////////////////////////////////////////////////////////////////////////////////
    // get 100 artist on rock genre
    var query = " \
      SELECT distinct * \
      WHERE {  \
          ?album a dbo:Album .  \
          ?album rdfs:label ?albumName.  \
          ?album dbo:artist ?Artist.\
          ?album dbo:genre ?genre.\
          Filter(?genre=dbpedia:Rock_music) \
        }  \
      GROUP BY ?album  \
      LIMIT 100   \
    ";

    sparqlClient.runQuery(query, [], []).then(function (results) {
      response.send(results);
    }).catch(function (error) {
      response.send(error.reasonPhrase);
    });
  }

}