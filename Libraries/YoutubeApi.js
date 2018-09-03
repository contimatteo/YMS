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
  search(queryString, numberOfResult, nextFunction) {
    youtube.search(queryString, numberOfResult, this.filters, function (error, result) {
      if (error) {
        console.log(error);
        nextFunction(null);
      } else {
        nextFunction(result);
      }
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  getById(id, nextFunction) {
    youtube.getById(id, function (error, result) {
      if (error) {
        console.log(error);
        nextFunction(null);
      } else {
        nextFunction(result);
      }
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};