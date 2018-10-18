
////////////////////////////////////////////////////////////////////////////////

// models
const Artist = require('../models/Artist.js');
const Band = require('../models/Band.js');
const Channel = require('../models/Channel.js');
const Video = require('../models/Video.js');
const User = require('../models/User.js');

////////////////////////////////////////////////////////////////////////////////

// var ApiError = require('../../libraries/schemas/ApiError.js');

module.exports = class TestController {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    // nothing to do
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // run db query exaple
  visualizzoDatiDiProva(response) {
    User.findAll({})
      .then(results => {
        // response.send(results);
        response.render('pages/test/db', {
          data: results
        });
      });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all bands with relative artists
  orm1(response) {
    Band.findAll({
        include: [{
          model: Artist
        }]
      })
      .then(results => {
        response.send(results);
      });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all artists with relative bands
  orm2(request, response, next) {
    Artist.findAll({
      include: [{
        model: Band
      }]
    }).then(results => {
      response.send(results);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all videos with his single channel
  orm3(response) {
    Video.findAll({
      include: [{
        model: Channel
      }]
    }).then(results => {
      response.send(results);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all channels with all of linked videos
  orm4(response) {
    Channel.findAll({
      include: [{
        model: Video
      }]
    }).then(results => {
      response.send(results);
    });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

};