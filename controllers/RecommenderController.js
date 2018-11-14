////////////////////////////////////////////////////////////////////////////////

var AjaxRequestClass = require('../libraries/AjaxRequest.js');
var AjaxRequest = new AjaxRequestClass();
////////////////////////////////////////////////////////////////////////////////

// module.exports = class TestController {
module.exports = {
  // fvitali get request
  vitali(id) {
    return new Promise((resolve, reject) => {
      var url = "http://site1825.tw.cs.unibo.it/TW/globpop?id="+id;
      AjaxRequest.jsonRequest(url, 'GET', {}).then(function (vitaliResponse) {
        var promises = [];
        vitaliResponse.recommended.forEach(video => {
          promises.push(VideosController._getVideoInfo(null, video.videoID));
        });
        Promise.all(promises)
        .then(videosData => {
          resolve(videosData);
        })
        .catch(error => {
          console.log(error);
          reject(error);
        });
      }).catch((error) => {
        console.log(error);
        reject(error);
      });
    });
  },
};

var VideosController = require('./VideosController.js');