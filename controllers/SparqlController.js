var SparqlLibrary = require('../libraries/Sparql.js')
const sparqlClient = new SparqlLibrary()

var DataHelper = require("../controllers/helpers/DataHelper")

const SONG_LIMIT = 20

var self = module.exports = {

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

  getArtistInfo(artistName) {
    // call dbpedia for get artist info
    var query = " " +
      " SELECT distinct * WHERE { " +
      "   ?artist foaf:name ?name. " +
      "   ?artist rdf:type ?type. " +
      "   optional { " +
      "     ?artist rdfs:comment ?description. " +
      "     filter langMatches(lang(?description), 'en') " +
      "   } " +
      "   FILTER(?name = \"" + artistName + "\"@en) " +
      "   FILTER( ?type IN(dbo:MusicalArtist, dbo:Band)) " +
      " }  ";

    return sparqlClient.runQuery(query, [], []);
  },

  getBandMember(artistName) {
    // call dbpedia for get artist info
    var query = " " +
      " select distinct * { " +
      " ?artist foaf:name ?a. " +
      " ?artist dbo:bandMember ?artistAssociated.  " +
      " ?artistAssociated  rdfs:label ?name.  " +
      " ?artistAssociated rdf:type ?type. " +
      "   optional { " +
      "     ?artistAssociated rdfs:comment ?description. " +
      "     filter langMatches(lang(?description), 'en') " +
      "   } " +
      "   FILTER(?a = \"" + artistName + "\"@en) " +
      "  filter langMatches(lang(?name), 'en')  " +
      "  filter ( ?type IN (dbo:MusicalArtist, dbo:MusicalBand) )  " +
      " }  ";
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },

  getFormerBandMember(artistName) {
    // call dbpedia for get artist info
    var query = " " +
      " select distinct * { " +
      " ?artist foaf:name ?a. " +
      " ?artist dbo:formerBandMember ?artistAssociated.  " +
      " ?artistAssociated  rdfs:label ?name.  " +
      " ?artistAssociated rdf:type ?type. " +
      "   optional { " +
      "     ?artistAssociated rdfs:comment ?description. " +
      "     filter langMatches(lang(?description), 'en') " +
      "   } " +
      "   FILTER(?a = \"" + artistName + "\"@en) " +
      "  filter langMatches(lang(?name), 'en')  " +
      "  filter ( ?type IN (dbo:MusicalArtist, dbo:MusicalBand) )  " +
      " }  ";
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },


  getSongInfo(artist, song) {
    var query = " " +
      " SELECT distinct * WHERE {  " +
      " ?song foaf:name ?name. " +
      " ?song rdf:type ?type.  " +
      " ?song dbo:artist ?producerLink.  " +
      " ?producerLink foaf:name ?producer.  " +
      " ?song dbo:genre ?genreUrl. " +
      " ?genreUrl rdfs:label ?genre. " +
      " ?song rdfs:comment ?abstract.  " +
      "   optional { " +
      "     ?song dbo:album ?albumLink.  " +
      "     ?albumLink foaf:name ?album.  " +
      "     FILTER langMatches(lang(?album), 'en')  " +
      "   } " +
      " FILTER langMatches(lang(?abstract), 'en')  " +
      " FILTER langMatches(lang(?genre), 'en')  ";

    const songNameParsed = DataHelper.songNameFormatter(song)
    if (songNameParsed.length < 1) {
      query = query + " FILTER( ?name = \"" + song + "\"@en ) "
    } else {
      query = query + " FILTER( ?name = \"" + song + "\"@en "
      songNameParsed.forEach((songName) => {
        query = query + " || ?name = \"" + songName + "\"@en "
      })
      query = query + " ) "
    }

    // var query =+ " FILTER( ?name = \"" + song + "\"@en ) ";
    query = query +" FILTER( ?producer = \"" + artist + "\"@en ) " +
      " FILTER( ?type IN(dbo:Single, dbo:Song) ) " +
      " } ";
    return sparqlClient.runQuery(query, [], []);
  },

  getSongsByGenre(genre) {
    // call dbpedia for get artist info
    var query = " " +
      " SELECT distinct * WHERE {  " +
      " ?song foaf:name ?name. " +
      " ?song rdf:type ?type.  " +
      // " ?song dbo:album ?albumLink.  " +
      // " ?albumLink foaf:name ?album.  " +
      " ?song dbo:artist ?producerLink.  " +
      " ?producerLink foaf:name ?producer.  " +
      " ?song dbo:genre ?genreUrl. " +
      " ?genreUrl rdfs:label ?genre. " +
      // " ?song rdfs:comment ?abstract.  " +
      // " FILTER langMatches(lang(?abstract), 'en')  " +
      " FILTER langMatches(lang(?genre), 'en')  " +
      " FILTER langMatches(lang(?producer), 'en')  " +
      // " FILTER langMatches(lang(?album), 'en')  " +
      " FILTER( ?genre = \"" + genre + "\"@en ) " +
      " FILTER( ?type IN(dbo:Single, dbo:Song) ) " +
      " } " +
      " LIMIT " + SONG_LIMIT;
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },


}