////////////////////////////////////////////////////////////////////////////////
var SparqlControllerClass = require('./SparqlController.js');
var jsonVitali = require("../json/video-vitali.json");
var SparqlController = new SparqlControllerClass();
var DataHelper = require('./helpers/DataHelper.js');
var ORMHelper = require('./helpers/ORMHelper.js');
var constants = require('./helpers/ConstantsHelper.js');
////////////////////////////////////////////////////////////////////////////////


////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // create artist on db
  create(response, artistName) {
    var artistNameFormatted = DataHelper.artistNameFormatter(artistName);
    var artistUrl = constants.sparql.dbpedia + artistNameFormatted;
    SparqlController.getArtistInfo(artistNameFormatted).then(function (artistInfo) {
      console.log(artistInfo);
        var result = artistInfo.results.bindings[0];
        var artistData = {};
        artistData.name = result.name.value;
        if (result.hasOwnProperty("description")) artistData.description = result.description.value;
        artistData.type = result.type.value;
        artistData.url = artistUrl;
        artistData.formatted_name = artistNameFormatted;
        ORMHelper.storeArtist(artistData).then(function (artistCreated) {
            response.send(artistCreated);
          })
          .catch(function (error) {
            response.send(error.errors[0].message);
          });
      })
      .catch(function (error) {
        response.send(error);
      });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // create artist on db
  createRelatedArtist(response, artistObject) {
    var artistNameFormatted = DataHelper.artistNameFormatter(artistObject.name.value);
    return new Promise(function (resolve, reject) {
        var artistData = {};
        artistData.name = artistObject.name.value;
        if (artistObject.hasOwnProperty("description")) artistData.description = artistObject.description.value;
        artistData.type = artistObject.type.value;
        artistData.url = artistObject.artistAssociated.value;
        artistData.formatted_name = artistNameFormatted;
        ORMHelper.storeArtist(artistData).then(function (artistCreated) {
            resolve(artistCreated);
          })
          .catch(function (error) {
            reject(error);
          });
      })
      .catch(function (error) {
        response.send(error);
      });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  createRelated(response, artistName) {
    var artistNameFormatted = DataHelper.artistNameFormatter(artistName);
    var artistUrl = constants.sparql.dbpedia + artistNameFormatted;
    SparqlController.getRelatedArtists(artistNameFormatted).then(function (artistsInfo) {
        var results = artistsInfo.results.bindings;
        var promises = [];
        results.forEach(artist => {
          promises.push(self.createRelatedArtist(response, artist));
        });
        Promise.all(promises)    
        .then(function(data){ response.send(data); })
        .catch(function(err){ response.send(err); });
      })
      .catch(function (error) {
        response.send(error.reasonPhrase);
      });
    // foreach all data finded on dbpedia create associated models and relations on db
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};