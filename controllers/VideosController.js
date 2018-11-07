////////////////////////////////////////////////////////////////////////////////
var AuthController = require('./AuthController.js');
var ArtistsController = require('./ArtistsController.js');
var YoutubeApi = require('../libraries/YoutubeApi.js');
var ORMHelper = require('./helpers/ORMHelper.js');
var Video = require("../models/Video.js");
var Promise = require('bluebird');
// var database = new mySqlDB();
const youtubeApi = Promise.promisifyAll(new YoutubeApi());

////////////////////////////////////////////////////////////////////////////////

var self = module.exports = {

  _findArtistAndSongByString(string) {
    return new Promise(function (resolve, reject) {
      var objectString = {
        artists: [],
        song: ""
      };
      string = string.trim();
      var splittedString = string.split("-");
      if (splittedString.length < 1) {
        splittedString = string.split(":");
      }
      // split song and artist
      splittedString.forEach(function (element, index) {
        splittedString[index] = element.trim();
        splittedString[index] = splittedString[index].replace(/ *\([^)]*\) */g, "");
        splittedString[index] = splittedString[index].replace(/ *\[[^\]]*\] */g, '');
        splittedString[index] = splittedString[index].replace(/ *\{[^)]*\} */g, "");
        splittedString[index] = splittedString[index].replace(/ *\{[^)]*\} */g, "");
        splittedString[index] = splittedString[index].replace(/Feat./g, 'feat.');
        splittedString[index] = splittedString[index].replace(/Feat/g, 'feat.');
        splittedString[index] = splittedString[index].replace(/Featuring./g, 'feat.');
        splittedString[index] = splittedString[index].replace(/Featuring/g, 'feat.');
        splittedString[index] = splittedString[index].replace(/Ft./g, 'feat.');
        splittedString[index] = splittedString[index].replace(/Ft/g, 'feat.');
        splittedString[index] = splittedString[index].replace(/ft./g, 'feat.');
        splittedString[index] = splittedString[index].replace(/ft/g, 'feat.');
        splittedString[index] = splittedString[index].replace(/featuring./g, 'feat.');
        splittedString[index] = splittedString[index].replace(/featuring/g, 'feat.');
        // splittedString[index] = splittedString[index].replace(/feat./g, '^');
        splittedString[index] = splittedString[index].trim();
        console.log(splittedString[index]);
      });
      console.log(splittedString);
      // 1° case: "Artist - song"
      // 2° case: "Artist feat. Artist - song"
      // 3° case: "Artist - song feat. Artist"
      if((splittedString[0].indexOf("feat.") < 0) && (splittedString[1].indexOf("feat.") < 0)) {
       // 1° case: "Artist - Song"
       resolve("Artist - Song");
     }
      if((splittedString[0].indexOf("feat.") > -1)) {
         // 2° case: "Artist feat. Artist - Song"
         resolve("Artist feat. Artist - Song");
      }
      if((splittedString[1].indexOf("feat.") > -1)) {
         // 3° case: "Artist - Song feat. Artist" oppure "Song - Artist feat. Artist"
         ArtistsController.getArtistInfo(null, splittedString[0]).then(function(artist) {
          if(artist!=null) {
            // case finded: "Artist - Song feat. Artist"
            console.log("Artist - Song feat. Artist");
            resolve("Artist - Song feat. Artist");
          }
          else {
            // case finded: "Song - Artist feat. Artist"
            console.log("Song - Artist feat. Artist");
            resolve("Song - Artist feat. Artist");
          }
         })
         .catch(function(error) {
          console.log(error);
         });
     }
      // // split various artist
      // objectString.artists = splittedString[0].split("feat.");
      // if (objectString.artists.length < 1) {
      //   objectString.artists = splittedString[0].split("Feat.");
      // }
      // // foreach artist finded
      // objectString.artists.forEach(artist => {
      //   artist = artist.trim();
      //   artist = artist.replace(/ *\([^)]*\) */g, "");
      //   artist = artist.trim();
      // });
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show single video by id
  show(response, id) {
    youtubeApi.getVideoById(id).then(function (results) {
      response.render('pages/video/video', {
        video: results.items[0]
      });
      // response.send(results.items[0]);
    }).catch(function (error) {
      response.send(error);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // show list of videos
  index(response, searchString, searchType, pageToken, numberResult) {
    youtubeApi.search(searchString, numberResult, pageToken).then(function (results) {
      // response.send(results);
      response.render('pages/search/search', {
        data: results.items,
        request: {
          "searchString": searchString,
          "searchType": searchType,
          "nextPage": results.nextPageToken,
          "previousPage": results.prevPageToken
        }
      });
    }).catch(function (error) {
      response.send(error.reasonPhrase);
    });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  create(response, title) {
    self._findArtistAndSongByString(title).then(function (objectString) {
        var song = objectString.song;
        var artist = objectString.artist;
        // console.log(song);
        // console.log(artist);
        // var promiseArray = [];
        // objectString.artists.forEach(artist => {
        //   promiseArray.push(ArtistsController.create(null, artist));
        // });
        // Promise.all(promiseArray)
        //   .then(data => {
        //     resolve(data);
        //   })
        //   .catch(error => {
        //     console.log("Second handler", error);
        //   });
        response.send(objectString);
      })
      .catch(function (error) {
        response.send(error);
      });
  },
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  addView(response, userId, videoId) {
    ORMHelper.getVideoById(videoId).then(function (videoObject) {
      // controllare che la "lunchezza" dell oggetto sia diversa da zero 
      // aggiungere una view
      Video.findById(videoObject.id).then(video => {
        return video.increment('views', {
          by: 1
        })
      })
      response.send(videoObject);
    });
  }

};