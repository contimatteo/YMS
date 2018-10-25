////////////////////////////////////////////////////////////////////////////////

var Promise = require("bluebird");
var YouTube = require('youtube-node');
var CustomError = require('./schemas/CustomError.js');
var config = require('../config/config.json');
var youtube = new YouTube();
var CustomError = require('./schemas/CustomError.js');
////////////////////////////////////////////////////////////////////////////////
youtube.setKey(config.development.youtube_api_key);

// need to take a look
// optional parameters : https://developers.google.com/youtube/v3/docs/search/list#optional-parameters

////////////////////////////////////////////////////////////////////////////////

module.exports = class YoutubeApi_Library {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    this.filters = {
      type: 'video',
      // relatedToVideoId: '1',
      videoCategoryId: '10',
      pageToken: ''
    };
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  search(queryString, numberOfResult, pageToken) {
    console.log("2. page: " + pageToken);
    this.filters.pageToken = pageToken;
    return new Promise((resolve, reject) => {
      youtube.search(queryString, numberOfResult, this.filters, function (error, result) {
        if (error) {
          // reject(new Error(error.message));
          console.log(error);
        }
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
        if (!result || !result.items || result.items.length < 1)
          reject(new CustomError(400, "video not found", ""));
        resolve(result);
      });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};