////////////////////////////////////////////////////////////////////////////////
const utf8 = require('utf8');

var SparqlController = require('./SparqlController.js');
var DataHelper = require('./helpers/DataHelper.js');
// var ORMHelper = require('./helpers/ORMHelper.js');
var constants = require('./helpers/ConstantsHelper.js');
var CustomError = require('../libraries/schemas/CustomError.js');
var Artist = require("../models/Artist.js");
var ArtistsRelated = require("../models/ArtistsRelated.js");
var ArtistsAndBands = require("../models/ArtistsAndBands.js");
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
        if (artistInfo == null || artistInfo.results.bindings.length < 1) {
          resolve(null);
        } else {
          if (artistInfo.results && self._checkArtist(artistInfo.results.bindings[0].type.value)) {
            resolve(artistInfo);
          } else {
            // this function works only for artists and not for bands.
            resolve(null);
          }
        }
      }).catch(function (error) {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getArtistByFormattedName(artistFormattedName) {
    return new Promise((resolve, reject) => {
      Artist.findAll({
        where: {
          formatted_name: artistFormattedName
        }
      }).then(results => {
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
            // artist type
            if (result.type.value == "http://dbpedia.org/ontology/Band") artistData.type = "band";
            else artistData.type = "artist";
            // try to find artist on db
            // artistUrl = constants.sparql.dbr + artistData.formatted_name;
            self.getArtistByFormattedName(artistData.formatted_name).then(function (artistFinded) {
              if (artistFinded.length > 0) {
                // artista founded
                resolve(artistFinded[0]);
              } else {
                // artist not found
                self.storeArtist(artistData).then(function (artistCreated) {
                    resolve(artistCreated);
                    // if this artist is a band start creating all band's member
                    if (artistCreated.type == "band") {
                      self.createBandMember(null, artistCreated.id, artistCreated.name);
                    }
                    // create related artists
                    self.createRelatedArtists(null, artistCreated.id, artistCreated.name);
                  })
                  .catch(function (error) {
                    if (error.errors && error.errors[0].message)
                      reject(error.errors[0].message)
                    reject(error);
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
  _storeArtistsRelatedtAssociation(artist1Id, artist2Id) {
    var association = {
      FKArtist1Id: artist1Id,
      FKArtist2Id: artist2Id
    };
    return new Promise((resolve, reject) => {
      var production = ArtistsRelated.build(association, {
        FKArtist1Id: association.FKArtist1Id,
        FKArtist2Id: association.FKArtist2Id
      });
      production.save().then(production => {
        resolve(production);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // private function for creating artist on db
  _storeRelatedArtist(response, startArtistId, artistObject) {
    var artistNameFormatted = self._artistNameFormatter(artistObject.name.value);
    return new Promise(function (resolve, reject) {
      var artistData = {};
      artistData.name = artistObject.name.value;
      if (artistObject.hasOwnProperty("description")) artistData.description = artistObject.description.value;
      artistData.dbpedia_type = artistObject.type.value;
      artistData.url = artistObject.artistAssociated.value;
      artistData.formatted_name = artistNameFormatted;
      if (artistObject.type.value == "http://dbpedia.org/ontology/Band") artistData.type = "band";
      else artistData.type = "artist";
      self.storeArtist(artistData).then(function (artistCreated) {
          self._storeArtistsRelatedtAssociation(startArtistId, artistCreated.id).then(function (results) {
            resolve(artistCreated);
          }).catch(function (error) {
            resolve(null);
          });
        })
        .catch(function (error) {
          reject(error);
        });
    })
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  createRelatedArtists(response, startArtistId, artistName) {
    return new Promise(function (resolve, reject) {
      var artistNameFormatted = self._artistNameFormatter(artistName);
      var artistUrl = constants.sparql.dbpedia + artistNameFormatted;
      SparqlController.getRelatedArtists(artistNameFormatted).then(function (artistsInfo) {
          var results = artistsInfo.results.bindings;
          var promises = [];
          results.forEach(artist => {
            promises.push(self._storeRelatedArtist(response, startArtistId, artist));
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
          resolve(null);
        });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  createBandMember(response, artistId, artistName) {
    return new Promise(function (resolve, reject) {
      var artistNameFormatted = self._artistNameFormatter(artistName);
      var artistUrl = constants.sparql.dbpedia + artistNameFormatted;
      return SparqlController.getBandMember(artistNameFormatted).then(function (membersList) {
          var results = membersList.results.bindings;
          var promises = [];
          results.forEach(bandMember => {
            promises.push(self._createRelatedBandMember(response, artistId, bandMember));
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
          resolve(null);
        });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  _createRelatedBandMember(response, artistId, bandMemeberObject) {
    return new Promise(function (resolve, reject) {
      var artistNameFormatted = self._artistNameFormatter(bandMemeberObject.name.value);
      var artistData = {};
      artistData.name = bandMemeberObject.name.value;
      if (bandMemeberObject.hasOwnProperty("description")) artistData.description = bandMemeberObject.description.value;
      artistData.dbpedia_type = bandMemeberObject.type.value;
      artistData.url = bandMemeberObject.artistAssociated.value;
      artistData.formatted_name = artistNameFormatted;
      if (bandMemeberObject.type.value == "http://dbpedia.org/ontology/Band") artistData.type = "band";
      else artistData.type = "artist";
      return self.storeArtist(artistData).then(function (bandMemberCreated) {
          self._storeArtistsRelatedtBandMemberAssociation(artistId, bandMemberCreated.id).then(function (results) {
            resolve(bandMemberCreated);
          }).catch(function (error) {
            resolve(null);
          });
        })
        .catch(function (error) {
          reject(error);
        });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  _storeArtistsRelatedtBandMemberAssociation(artistId, bandMemeberId) {
    var association = {
      FKArtistId: bandMemeberId,
      FKBandId: artistId
    };
    return new Promise((resolve, reject) => {
      var assoc = ArtistsAndBands.build(association, {
        FKArtistId: association.FKArtistId,
        FKBandId: association.FKBandId
      });
      assoc.save().then(assoc => {
        resolve(assoc);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  storeArtist(artistData) {
    return new Promise((resolve, reject) => {
      var artist = Artist.build(artistData, {
        firstname: utf8.encode(artistData.firstname),
        lastname: utf8.encode(artistData.lastname),
        url: artistData.url,
      });
      artist.save().then(artistCreated => {
        resolve(artistCreated);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getRelatedArtistsById(artistId) {
    return new Promise((resolve, reject) => {
      Artist.findOne({
        include: [{
          model: Artist,
          as: 'Related'
        }],
        where: {
          id: artistId
        }
      }).then(results => {
        resolve(results);
      }).catch((error) => {
        reject(error);
      });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getBandsMembersById(artistId) {
    return new Promise((resolve, reject) => {
      Artist.findOne({
        include: [{
          model: Artist,
          as: 'BandMembers'
        }],
        where: {
          id: artistId
        }
      }).then(results => {
        resolve(results);
      }).catch((error) => {
        reject(error);
      });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};