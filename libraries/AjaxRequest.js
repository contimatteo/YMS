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

const ApiResponse = require('./schemas/ApiResponse.js');
////////////////////////////////////////////////////////////////////////////////

module.exports = class AjaxRequest {
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
  jsonRequest(url, typeRequest, data) {
    return new Promise((resolve, reject) => {
      // Configure the request
      this.options = {
        url: url,
        method: typeRequest,
        headers: this.headers,
        form: data
      };
      var result;
      // Start the request
      request(this.options, function (error, response, body) {
        if (!error) {
          result = new ApiResponse();
          result.status_code = response.statusCode;
          result.reason_phrase = response.statusCode;
          if (response.statusCode == 200) {
            // all goes ok
            // result.data = response.body;
            try {
              result.data = JSON.parse(response.body)
            } catch (ex) {
              result.data = {}
            }
            // resolve(JSON.parse(response.body));
            resolve(result.data)
          } else {
            // something went wrong
            if (error) {
              // error
              reject(error);
            } else {
              // no error and status code not 200
              resolve(result);
            }
          }
        } else {
          resolve(null)
        }
      });
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

}