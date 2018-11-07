var Promise = require("bluebird");
////////////////////////////////////////////////////////////////////////////////
var Artist = require("../../models/Artist.js");
var Video = require("../../models/Video.js");
var Productions = require("../../models/Productions.js");
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

  storeVideo(videoObject) {
    return new Promise((resolve, reject) => {
      var video = Video.build(videoObject, {
        title: videoObject.title,
        description: videoObject.description,
        //FKChannelId: videoObject.channelId,
        views: videoObject.views,
        youtube_id: videoObject.youtube_id,
      });
      video.save().then(videoCreated => {
        resolve(videoCreated);
      }).catch((error) => {
        reject(error);
      });
    });
  },

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
        console.log(production);
        resolve(production);
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
         reject(error);
      });
    });
  }


  // creare la funzione che incrementa le view

};
////////////////////////////////////////////////////////////////////////////////