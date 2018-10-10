/* * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *
 *          AJAX LIBRARY
 *
 *  author:        Conti Matteo
 *  description:   simple library for create ajax request.
 *  version:       1.0.0
 *  git repo:      ...
 *  created:       22/07/2018
 *  updated:       22/07/2018
 *
 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 */

////////////////////////////////////////////////////////////////////////////////

var request = require('request');

////////////////////////////////////////////////////////////////////////////////

const ApiResponse = require('./schemas/ApiResponse.js');

////////////////////////////////////////////////////////////////////////////////

module.exports = class AjaxRequest_Library {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    // Set the headers
    this.headers = {  
      'User-Agent': 'YMS Agent/0.0.1',
      'Content-Type': 'application/json'
    };
    this.options = {};
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // ...
  jsonRequest(url, typeRequest, data, nextFunction) {
    // Configure the request
    this.options = {
      url: url,
      method: typeRequest,
      headers: this.headers,
      form: data
    };
    var result;
    // Start the request
    request(this.options, function(error, response, body) {
      result = new ApiResponse();
      result.status_code = response.statusCode;
      result.reason_phrase = response.statusCode;
      //Object.assign(result.errors, error);
      if (!error && response.statusCode == 200) {
        result.data = response.body;
        nextFunction(result);
      }
      else {
        nextFunction(null);
      }
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
}