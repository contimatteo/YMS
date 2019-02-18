var YouTubeClass = require('youtube-node')
var CustomError = require('./schemas/CustomError.js')
var config = require('../config/config.json')

var youtube = new YouTubeClass()
var CustomError = require('./schemas/CustomError.js')
const fetchCommentPage = require('youtube-comment-api')
youtube.setKey(config.development.youtube_api_key)

// need to take a look
// optional parameters : https://developers.google.com/youtube/v3/docs/search/list#optional-parameters

module.exports = class YoutubeApi_Library {
  constructor() {
    this.numberOfResult = 10;
    this.filters = {
      type: 'video',
      videoCategoryId: '10',
      pageToken: ''
    };
  }

  search(queryString, numberOfResult, pageToken, searchType = null) {
    var limit = 0;
    this.filters.pageToken = pageToken;
    // check search type
    if (searchType == "id") {
      // id search type selected
      limit = 1;
    } else {
      // default search type selected
      limit = numberOfResult;
    }
    return new Promise((resolve, reject) => {
      return youtube.search(queryString, limit, this.filters, function (error, result) {
        if (error) {
          reject(new Error(error.message))
        }
        // all goes ok
        resolve(result)
      })
    })
  }

  getVideoById(id) {
    return new Promise((resolve, reject) => {
      youtube.getById(id, function (error, result) {
        if (error) {
          reject(error)
        } else {
          if (!result || !result.items || result.items.length < 1) reject(new CustomError(400, "video not found", ""))
          // all goes ok
          resolve(result)
        }
      })
    })
  }

  getVideoRelatedById(id, numberOfResult) {
    return new Promise((resolve, reject) => {
      youtube.related(id, numberOfResult, function (error, result) {
        if (!error) {
          resolve(result)
        } else {
          reject(error)
        }
      })
    })
  }

  getCommentByVideoId(videoId) {
    return new Promise((resolve, reject) => {
      fetchCommentPage(videoId)
        .then(commentList => {
          resolve(commentList)
        })
        .catch(error => {
          resolve(null)
        })
    })
  }

}