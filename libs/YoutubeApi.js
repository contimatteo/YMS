////////////////////////////////////////////////////////////////////////////////
var YouTube = require('youtube-node');
////////////////////////////////////////////////////////////////////////////////
var youtube = new YouTube();
////////////////////////////////////////////////////////////////////////////////
youtube.setKey(process.env.YOUTUBE_API_KEY);
////////////////////////////////////////////////////////////////////////////////
// need to take a look
// optional parameters : https://developers.google.com/youtube/v3/docs/search/list#optional-parameters
////////////////////////////////////////////////////////////////////////////////
module.exports = class YoutubeApi_Library {
  constructor() {
    this.filters = {type: 'video', videoCategoryId: '10'};
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  search(queryString, numberOfResult, nextCallback) {
    youtube.search(queryString, numberOfResult, this.filters, function (error, result) {
      if (error) {
        console.log(error);
        nextCallback(null);
      } else {
        nextCallback(result);
      }
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getById(id, nextCallback) {
    youtube.getById(id, function (error, result) {
      if (error) {
        console.log(error);
        nextCallback(null);
      } else {
        nextCallback(result);
      }
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};