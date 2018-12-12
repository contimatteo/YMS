////////////////////////////////////////////////////////////////////////////////

var Channel = require("../models/Channel.js");
var Promise = require('bluebird');
var YoutubeApi = require('../libraries/YoutubeApi.js');
const utf8 = require('utf8');
// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {

  findOrCreateChannel(channelYoutubeId, channelName) {
    return new Promise((resolve, reject) => {
      var channelObject = {
        youtube_id: channelYoutubeId,
        name: channelName
      };
      Channel.findOrCreate({
        where: {
          youtube_id: channelObject.youtube_id
        },
        defaults: {
          youtube_id: channelObject.youtube_id,
          name: utf8.encode(channelObject.name)
        }
      }).spread( function(channelCreated, created){
        resolve(channelCreated);
      });
    });
  }

};