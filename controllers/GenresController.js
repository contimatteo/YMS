const utf8 = require('utf8')

var Genre = require("../models/Genre.js")
var SparqlController = require("../controllers/SparqlController")

var YoutubeApi = require('../libraries/YoutubeApi.js')
const youtubeApi = new YoutubeApi()

var constants = require('./helpers/ConstantsHelper.js')

var self = module.exports = {

  findOrCreateGenre(name, url) {
    return new Promise((resolve, reject) => {
      var channelObject = {
        name: name,
        url: url
      };
      Genre.findOrCreate({
        where: {
          name: channelObject.name,
          url: channelObject.url
        },
        defaults: {
          name: utf8.encode(channelObject.name),
          url: channelObject.url
        }
      }).spread(function (genreCreated, created) {
        resolve(genreCreated)
      })
    })
  },


  getAndSearchSongsByGenre(genre) {
    return new Promise((resolve, reject) => {
      SparqlController.getSongsByGenre(genre).then((songs) => {
        var songsYoutubeSearchPromises = []
        if (songs) {
          var songFoundNumber = 0
          songs = songs.results.bindings
          // calculate how many video will i search foreach song
          songs.forEach((song) => {
            if (song && song.name && song.producer) {
              songFoundNumber++
            }
          })
          const videoForEachSong = Math.round(constants.recommenderVideosNumber / songFoundNumber)
          songs.forEach((song) => {
            if (song && song.name && song.producer) {
              const searchedString = song.producer.value + " - " + song.name.value
              songsYoutubeSearchPromises.push(youtubeApi.search(searchedString, videoForEachSong, null))
            }
          })
        }
        Promise.all(songsYoutubeSearchPromises)
          .then(videosData => {
            var videos = []
            videosData.forEach((youtubeSearch, index) => {
              if (youtubeSearch && youtubeSearch.items && youtubeSearch.items.length > 0)
              videos.push(youtubeSearch.items[0])
            })
            resolve(videos)
          })
          .catch(error => {
            console.log("61 Genres Controller ", error)
            reject(error)
          }).catch((error) => {
            console.log("64 Genres Controller ", error)
            reject(error)
          })
      }).catch((error) => {
        console.log("68 Genres Controller ", error)
        reject(error)
      })
    })
  }

}