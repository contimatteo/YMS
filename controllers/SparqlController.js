////////////////////////////////////////////////////////////////////////////////

var SparqlLibrary = require('../libraries/Sparql.js');
const sparqlClient = new SparqlLibrary();

////////////////////////////////////////////////////////////////////////////////

// var ApiError = require('../../libraries/schemas/ApiError.js');

var self = module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // 
  sparql(response) {
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
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
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
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
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
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
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
    // get all properties of resource (non ho capito se funziona)
    // prefix dbr:<http://dbpedia.org/resource/>
    // prefix dbo:<http://dbpedia.org/ontology/> 
    // prefix dbp:<http://dbpedia.org/property/> 
    // prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
    // select distinct ?property ?label {
    //   { dbr:Green_Day ?property ?o }
    //   union
    //   { ?s ?property dbr:Green_Day }

    //   optional { 
    //     ?property rdfs:label ?label .
    //     filter langMatches(lang(?label), 'en')
    //   }
    // }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
    // get all properties of resource (QUESTA FUNZIONA)
    // prefix dbr:<http://dbpedia.org/resource/>
    // prefix dbo:<http://dbpedia.org/ontology/> 
    // prefix dbp:<http://dbpedia.org/property/> 
    // prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
    // select distinct ?property ?label{
    // dbr:Green_Day ?property ?value
    // optional { 
    //       ?value rdfs:label ?label .
    //       filter langMatches(lang(?label), 'en')
    //     }
    // }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
    // get the value of single resource's property (in this case "dbo:genre")
    // prefix dbr:<http://dbpedia.org/resource/>
    // prefix dbo:<http://dbpedia.org/ontology/> 
    // prefix dbp:<http://dbpedia.org/property/> 
    // prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#> 

    // select distinct  ?value{
    //  dbr:Green_Day dbo:genre ?value
    // }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
    // get all former band members with relative name (label)
    // prefix dbr:<http://dbpedia.org/resource/>
    // prefix dbo:<http://dbpedia.org/ontology/> 
    // prefix dbp:<http://dbpedia.org/property/> 
    // prefix rdfs:<http://www.w3.org/2000/01/rdf-schema#> 
    // select distinct *{
    // dbr:Green_Day dbo:formerBandMember ?value1.
    // optional { 
    //        ?value1 rdfs:label ?label .
    //        filter langMatches(lang(?label), 'en')
    //      }
    // }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
    // get all songs written by Green Day
    // select distinct *{
    //   ?value1 dbo:artist dbr:Green_Day.
    //  optional { 
    //         ?value1 rdfs:label ?label .
    //         filter langMatches(lang(?label), 'en')
    //       }
    //  }
    // ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ ~ 
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
      " }  " ;
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
    " }  " ;
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getBandMemeber(artistName) {
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
    " }  " ;
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getBandMember(bandName) {
    // call dbpedia for get artist info
    var query = " " +
    " select distinct * { " +
    " ?artistAssociated dbo:associatedBand dbr:" + artistName + ". " +
    " ?artistAssociated  rdfs:label ?name.  " +
    " ?artistAssociated rdf:type ?type. " +
    // "   optional {  " +
    // "     ?artistAssociated dct:description ?description.  " +
    // "     ?description rdfs:label ?description .  " +
    // "     filter langMatches(lang(?description), 'en')  " +
    // "  }  " +
    "  filter langMatches(lang(?name), 'en')  " +
    "  filter ( ?type IN (dbo:MusicalArtist, dbo:MusicalBand) )  " +
    " }  " ;
    //" GROUP BY ?prop "
    return sparqlClient.runQuery(query, [], []);
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}