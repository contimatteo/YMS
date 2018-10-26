////////////////////////////////////////////////////////////////////////////////
var SparqlControllerClass = require('./SparqlController.js');
var jsonVitali = require("../json/video-vitali.json");
var SparqlController = new SparqlControllerClass();
////////////////////////////////////////////////////////////////////////////////
var Artist = require("../models/Artist.js");
var ArtistModel = new Artist();



////////////////////////////////////////////////////////////////////////////////

module.exports = class DataController {

  constructor() {

  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  vitali(request, response) {
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  createArtist(artistName) {
    // var artistData = SparqlController.getArtistInfo(artistName);
    var artistData = {
      firstname: "Paolo",
      lastname: "Nutini",
      url: "pippo2"
    };
    var artist = Artist.build(artistData, {
      firstname: artistData.firstname,
      lastname: artistData.lastname,
      url: artistData.url,
    });
    artist.save().then(a => {
      return a;
    }).catch((error) => {
     return error;
    });

    // create artist model by artist name
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  createArtistRelatedResources(artistName) {
    SparqlController.getArtistRelatedResources(artistName);
    // foreach all data finded on dbpedia create associated models and relations on db
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
};