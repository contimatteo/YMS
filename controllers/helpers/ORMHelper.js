var Promise = require("bluebird");
////////////////////////////////////////////////////////////////////////////////
var Artist = require("../../models/Artist.js");
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
  }

}
////////////////////////////////////////////////////////////////////////////////