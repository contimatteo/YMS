////////////////////////////////////////////////////////////////////////////////
var SparqlControllerClass = require('./SparqlController.js');
var jsonVitali = require("../json/video-vitali.json");
var SparqlController = new SparqlControllerClass();
var DataHelper = require('./helpers/DataHelper.js');
var ORMHelper = require('./helpers/ORMHelper.js');
var constants = require('./helpers/ConstantsHelper.js');
var CustomError = require('../libraries/schemas/CustomError.js');
////////////////////////////////////////////////////////////////////////////////
var Artist = require("../models/Artist.js");

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {
  _checkArtist(dbpedia_type) {
    if (dbpedia_type == "http://dbpedia.org/ontology/MusicalArtist" || dbpedia_type == "http://dbpedia.org/ontology/Band")
      return true;
    else
      return false;
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  _artistNameFormatter(artist) {
    artist = artist.trim();
    artist = artist.toLowerCase();
    var arraySplittedArtist = artist.split(" ");
    // ...
    for (var i = 0; i < arraySplittedArtist.length; i++) {
      arraySplittedArtist[i] = DataHelper.capitalizeFirstLetter(arraySplittedArtist[i]);
    }
    // ...
    var newArtist;
    for (var i = 0; i < arraySplittedArtist.length; i++) {
      if (i == 0) {
        newArtist = arraySplittedArtist[i]; + '_';
      } else {
        newArtist = newArtist + '_' + arraySplittedArtist[i];
      }
    }
    return newArtist;
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get artist info
  getArtistInfo(response, artistName) {
    return new Promise(function (resolve, reject) {
      var artistNameFormatted = self._artistNameFormatter(artistName);
      SparqlController.getArtistInfo(artistNameFormatted).then(function (artistInfo) {
        if (artistInfo.results.bindings.length < 1) {
          console.log("prendo da dbpedia le info per l'artista " + artistNameFormatted);
          console.log(artistInfo);
          resolve(null);
        } else {
          if (artistInfo.results && self._checkArtist(artistInfo.results.bindings[0].type.value)) {
            resolve(artistInfo);
          } else {
            reject(new CustomError(400, "bad call", "this function works only for artists and not for bands."));
          }
        }
      }).catch(function (error) {
        console.log(error);
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getArtistByUrl(artistUrl) {
    return new Promise((resolve, reject) => {
      Artist.findAll({
        where: {
          url: artistUrl
        }
      }).then(results => {
        console.log("cerco un artista che ha url: " + artistUrl);
        console.log(results.length);
        // console.log("Session: %j", results[0].id);
        resolve(results);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // create artist on db
  create(response, artistName) {
    return new Promise(function (resolve, reject) {
      var artistNameFormatted = self._artistNameFormatter(artistName);
      var artistUrl = constants.sparql.dbpedia + artistNameFormatted;
      self.getArtistInfo(null, artistName).then(function (artistInfo) {
          if (!artistInfo) {
            resolve(null);
          }
          if (artistInfo.results && self._checkArtist(artistInfo.results.bindings[0].type.value)) {
            var result = artistInfo.results.bindings[0];
            var artistData = {};
            artistData.name = result.name.value;
            if (result.hasOwnProperty("description")) artistData.description = result.description.value;
            artistData.dbpedia_type = result.type.value;
            artistData.url = artistUrl;
            artistData.formatted_name = artistNameFormatted;
            self.getArtistByUrl(artistUrl).then(function (artistFinded) {
              if (artistFinded.length > 0) {
                // artista founded
                console.log("artista già presente: " + artistFinded[0].id);
                resolve(artistFinded[0]);
              } else {
                // artist not found
                console.log("artista non trovato");
                ORMHelper.storeArtist(artistData).then(function (artistCreated) {
                    resolve(artistCreated);
                  })
                  .catch(function (error) {
                    reject(error.errors[0].message);
                  });
              }
            }).catch(function (error) {
              reject(error);
            });
          } else {
            reject(new CustomError(400, "bad call", "this function works only for artists and not for bands."));
          }
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // private function for creating artist on db
  _createRelatedArtist(response, artistObject) {
    var artistNameFormatted = self._artistNameFormatter(artistObject.name.value);
    return new Promise(function (resolve, reject) {
        var artistData = {};
        artistData.name = artistObject.name.value;
        if (artistObject.hasOwnProperty("description")) artistData.description = artistObject.description.value;
        artistData.dbpedia_type = artistObject.type.value;
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
    return new Promise(function (resolve, reject) {
      var artistNameFormatted = self._artistNameFormatter(artistName);
      var artistUrl = constants.sparql.dbpedia + artistNameFormatted;
      SparqlController.getRelatedArtists(artistNameFormatted).then(function (artistsInfo) {
          var results = artistsInfo.results.bindings;
          var promises = [];
          results.forEach(artist => {
            promises.push(self._createRelatedArtist(response, artist));
          });
          Promise.all(promises)
            .then(function (data) {
              resolve(data);
            })
            .catch(function (error) {
              reject(error);
            });
        })
        .catch(function (error) {
          response.send(error.reasonPhrase);
        });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};