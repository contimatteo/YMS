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

 const chalk = require('chalk');
var request = require('request');
const ApiResponse = require('./schemas/ApiResponse.js');

const warning = chalk.blue
const success = chalk.green

const REQUEST_TIMEOUT = 2000
const ELAPSED_TIME_LIMIT_FOR_DEBUG = 1000

module.exports = class AjaxRequest {

  constructor() {
    // Set the headers
    this.headers = {
      'Content-Type': 'application/json'
    };
    this.options = {
      // timeout: REQUEST_TIMEOUT
    }
  }

  jsonRequest(url, typeRequest, data) {
    return new Promise((resolve, reject) => {
      // Configure the request
      this.options = {
        url: url,
        time: true,
        method: typeRequest,
        headers: this.headers,
        form: data
      };

      // Start the request
      request(this.options, function (error, response, body) {
        let data = {}

        if (!error && response.statusCode == 200) {
          data = response.body

          //  INFO:  debugging external resourcexs reponse time
          if (response.elapsedTime > ELAPSED_TIME_LIMIT_FOR_DEBUG)
            console.log(warning("[RESPONSE]"), `response --- in ${response.elapsedTime} milliseconds --- from ${url}`)
          else
            console.log(`[RESPONSE] response --- in ${response.elapsedTime} milliseconds --- from ${url}`)

          try {
            const dataJSON = JSON.parse(data)
            resolve(dataJSON)
          } catch (ex) {
            resolve(data)
          }

        } else {

          if (response.statusCode !== 200)
            console.log(chalk.red("[RESPONSE]"), `response --- in ${response.elapsedTime} milliseconds --- from ${url} --- with code ${response.statusCode}`)

          if (error)
            console.log(chalk.red("[RESPONSE]"), `response --- in ${response.elapsedTime} milliseconds --- from ${url} --- with error ${error}`)

          resolve({})
        }
      });
    });
  }

}