////////////////////////////////////////////////////////////////////////////////

var Promise = require("bluebird");
var YouTube = require('youtube-node');
var CustomError = require('./schemas/CustomError.js');
require('dotenv').config({
  path: __dirname + '/.env'
});
var youtube = new YouTube();

////////////////////////////////////////////////////////////////////////////////
console.log(process.env.YOUTUBE_API_KEY);
youtube.setKey(process.env.YOUTUBE_API_KEY);

// need to take a look
// optional parameters : https://developers.google.com/youtube/v3/docs/search/list#optional-parameters

////////////////////////////////////////////////////////////////////////////////

module.exports = class YoutubeApi_Library {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    this.filters = {
      type: 'video',
      videoCategoryId: '10'
    };
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  search(queryString, numberOfResult, callback) {
    return new Promise((resolve, reject) => {
      youtube.search(queryString, numberOfResult, this.filters, function (error, result) {
        if (error)
          reject(error);
        // all goes ok
        resolve(result);
      });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getVideoById(id) {
    return new Promise((resolve, reject) => {
      youtube.getById(id, function (error, result) {
        if (error)
          reject(error);
        if (result.items.length < 1)
          reject(new CustomError(400, "video not found", ""));
        resolve(result);
      });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};