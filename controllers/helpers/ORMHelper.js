var Promise = require("bluebird");
////////////////////////////////////////////////////////////////////////////////
var Artist = require("../../models/Artist.js");
var Video = require("../../models/Video.js");
var Productions = require("../../models/Productions.js");
////////////////////////////////////////////////////////////////////////////////
module.exports = {
  
  storeVideoAndArtistAssociation(artistId, videoId) {
    var association = {
      FKMusicianId: artistId,
      FKVideoId: videoId
    };
    return new Promise((resolve, reject) => {
      var production = Productions.build(association, {
        FKMusicianId: association.artistId,
        FKVideoId: association.videoId
      });
      production.save().then(production => {
        resolve(production);
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  },

  // creare la funzione che incrementa le view

};
////////////////////////////////////////////////////////////////////////////////