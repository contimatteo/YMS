const utf8 = require('utf8')

var Genre = require("../models/Genre.js")


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
  }

}