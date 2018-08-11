////////////////////////////////////////////////////////////////////////////////
var YouTube = require('youtube-node');
////////////////////////////////////////////////////////////////////////////////
var youtube = new YouTube();
////////////////////////////////////////////////////////////////////////////////
youtube.setKey(process.env.YOUTUBE_API_KEY);
////////////////////////////////////////////////////////////////////////////////
module.exports = class YoutubeApi {
  constructor() {

  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  search(queryString, numberOfResult, searchParameters, nextCallback) {
    youtube.search(queryString, numberOfResult, searchParameters, function(error, result) {
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
    youTube.getById(id, function(error, result) {
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