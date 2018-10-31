var Promise = require("bluebird");
////////////////////////////////////////////////////////////////////////////////
var Artist = require("../../models/Artist.js");
var Video = require("../../models/Video.js");
////////////////////////////////////////////////////////////////////////////////
module.exports = {

  storeArtist(artistData) {
    return new Promise((resolve, reject) => {
      var artist = Artist.build(artistData, {
        firstname: artistData.firstname,
        lastname: artistData.lastname,
        url: artistData.url,
      });
      artist.save().then(artistCreated => {
        resolve(artistCreated);
      }).catch((error) => {
        reject(error);
      });
    });
  },

  getVideoById(videoId) {
    return new Promise((resolve, reject) => {
      Video.findAll({
        include: [{
          model: Artist
        }],
        where: {
          youtube_id: videoId
        }
      }).then(results => {
        resolve(results); 
      }).catch((error) => {
        // aggiungi il video al db
         reject(error);
      });
    });
  }


  // creare la funzione che incrementa le view

};
////////////////////////////////////////////////////////////////////////////////