////////////////////////////////////////////////////////////////////////////////
// models
const Artist = require('../models/Artist.js');
const Band = require('../models/Band.js');
const Channel = require('../models/Channel.js');
const Video = require('../models/Video.js');
const User = require('../models/User.js');
var DataHelper = require('./helpers/DataHelper.js');
var AjaxRequestClass = require('../libraries/AjaxRequest.js');
var AjaxRequest = new AjaxRequestClass();
var SparqlController = require('./SparqlController.js');
var VideosController = require('./VideosController.js');
var GenresController = require('./GenresController.js');
////////////////////////////////////////////////////////////////////////////////

// module.exports = class TestController {
var self = module.exports = {
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
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all bands with relative artists
  orm1(response) {
    Video.findAll({
        include: [{
            model: Artist
          },
          {
            model: Channel
          }
        ]
      })
      .then(results => {
        response.send(results);
      });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // get all artists with relative bands
  orm2(request, response, next) {
    Artist.findAll({
      include: [{
        model: Video
      }]
    }).then(results => {
      response.send(results);
    });
  },
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
  },
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
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // init artists
  initializeName(response) {
    var formattedObject = DataHelper.nameFormatter("EMINEM", "Lose yourself");
    response.send(formattedObject);
    // cercare l'url vero di riferimento su dbpedia
    // importare i dati
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};