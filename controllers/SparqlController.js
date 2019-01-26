////////////////////////////////////////////////////////////////////////////////
var SparqlLibrary = require('../libraries/Sparql.js');
const sparqlClient = new SparqlLibrary();
////////////////////////////////////////////////////////////////////////////////


var self = module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // 
  sparql(response) {
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
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getArtistInfo(artistName) {
    // call dbpedia for get artist info
    var query = " " +
      " select distinct * { " +
      " dbr:" + artistName + "  rdfs:label ?name.  " +
      " dbr:" + artistName + " rdf:type ?type. " +
      "   optional {  " +
      "     dbr:" + artistName + " dct:description ?description.  " +
      "     ?description rdfs:label ?description .  " +
      "     filter langMatches(lang(?description), 'en')  " +
      "  }  " +
      "  filter langMatches(lang(?name), 'en')  " +
      "  filter ( ?type IN (dbo:MusicalArtist, dbo:Band) )  " +
      " }  ";
    // " GROUP BY ?prop ";
    return sparqlClient.runQuery(query, [], []);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getRelatedArtists(artistName) {
    // call dbpedia for get artist info
    var query = " " +
      " select distinct * { " +
      " ?artistAssociated dbo:associatedMusicalArtist dbr:" + artistName + ". " +
      " ?artistAssociated  rdfs:label ?name.  " +
      " ?artistAssociated rdf:type ?type. " +
      // "   optional {  " +
      // "     ?artistAssociated dct:description ?description.  " +
      // "     ?description rdfs:label ?description .  " +
      // "     filter langMatches(lang(?description), 'en')  " +
      // "  }  " +
      "  filter langMatches(lang(?name), 'en')  " +
      "  filter ( ?type IN (dbo:MusicalArtist, dbo:MusicalBand) )  " +
      " }  ";
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getBandMember(artistName) {
    // call dbpedia for get artist info
    var query = " " +
      " select distinct * { " +
      "     dbr:" + artistName + " dbo:bandMember ?artistAssociated.  " +
      " ?artistAssociated  rdfs:label ?name.  " +
      " ?artistAssociated rdf:type ?type. " +
      // "   optional {  " +
      // "     ?artistAssociated dct:description ?description.  " +
      // "     ?description rdfs:label ?description .  " +
      // "     filter langMatches(lang(?description), 'en')  " +
      // "  }  " +
      "  filter langMatches(lang(?name), 'en')  " +
      "  filter ( ?type IN (dbo:MusicalArtist, dbo:MusicalBand) )  " +
      " }  ";
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getSongInfo(songFormattedName) {
    var query = " " +
      " select distinct * { " +
      " dbr:" + songFormattedName + " rdf:type ?type. " +
      " dbr:" + songFormattedName + " dbo:abstract ?abstract.  " +
      " dbr:" + songFormattedName + " dbo:genre ?genreUrl.  " +
      " ?genreUrl rdfs:label ?genre.  " +
      "   optional {  " +
      "     dbr:" + songFormattedName + " rdfs:label ?songTitle. " +
      "     filter langMatches(lang(?label), 'en')  " +
      "   }  " +
      " filter langMatches(lang(?abstract), 'en')  " +
      " filter ( ?type IN (dbo:Single) )  " +
      " }  ";
    return sparqlClient.runQuery(query, [], []);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}