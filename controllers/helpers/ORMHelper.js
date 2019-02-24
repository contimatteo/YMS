// var Promise = require("bluebird");
////////////////////////////////////////////////////////////////////////////////
var Artist = require("../../models/Artist.js");
var Video = require("../../models/Video.js");
var Channel = require("../../models/Channel.js");
var Productions = require("../../models/Productions.js");

const Sequelize = require('sequelize')
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
        reject(error);
      });
    });
  },

  getVideoRandom() {
    return new Promise((resolve, reject) => {
      Video.findOne({
        include: [{
          model: Channel
        }],
        order: Sequelize.literal('rand()'),
      }).then(function (videoRandom) {
        resolve(videoRandom)
      }).catch(function (error) {
        reject(error)
      })
    })
  },

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};
////////////////////////////////////////////////////////////////////////////////