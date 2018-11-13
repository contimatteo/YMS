////////////////////////////////////////////////////////////////////////////////
var AjaxRequestClass = require('../libraries/AjaxRequest.js');
var AjaxRequest = new AjaxRequestClass();
////////////////////////////////////////////////////////////////////////////////

// module.exports = class TestController {
var self = module.exports = {
  // fvitali get request
  vitali(res, id) {
    return new Promise((resolve, reject) => {
      var url = "http://site1825.tw.cs.unibo.it/TW/globpop?id="+id;
      AjaxRequest.jsonRequest(url, 'GET', {}).then(function (vitaliResponse) {
        resolve(vitaliResponse);
      }).catch((error) => {
        reject(error);
      });
    });
  }
};