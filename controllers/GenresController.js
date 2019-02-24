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


  getAndSearchSongsByVideo(videoRecord) {
    return new Promise((resolve, reject) => {
      if (videoRecord && videoRecord.Genre && videoRecord.Genre.name) {
        const genre = videoRecord.Genre.name
        SparqlController.getSongsByGenre(genre).then((songs) => {
          var songsYoutubeSearchPromises = []
          if (songs) {
            var songFoundNumber = 0
            songs = songs.results.bindings
            // calculate how many video will i search foreach song
            songs.forEach((song) => {
              if (song && song.name && song.producer) {
                 // avoid getting the same video
                 if (videoRecord.song_name !== song.name.value)
                  songFoundNumber++
              }
            })
            const videoForEachSong = Math.round(constants.recommenderVideosNumber / songFoundNumber)
            songs.forEach((song) => {
              if (song && song.name && song.producer) {
                const searchedString = song.producer.value + " - " + song.name.value
                // avoid getting the same video
                if (videoRecord.song_name !== song.name.value)
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
              reject(error)
            }).catch((error) => {
              reject(error)
            })
        }).catch((error) => {
          reject(error)
        })
      } else {
        reject({})
      }
    })
  }

}