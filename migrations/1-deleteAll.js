'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Artists", deps: []
 * createTable "Bands", deps: []
 * createTable "Channels", deps: []
 * createTable "Genres", deps: []
 * createTable "Users", deps: []
 * createTable "ArtistsAndBands", deps: [Artists, Artists]
 * createTable "ArtistsRelated", deps: [Artists, Artists]
 * createTable "Videos", deps: [Channels, Genres]
 * createTable "Productions", deps: [Artists, Videos]
 * createTable "ViewsHistory", deps: [Videos, Users]
 *
 **/

var info = {
  "revision": 1,
  "name": "1",
  "created": "2018-11-28T11:50:08.710Z",
  "comment": ""
};

var migrationCommands = [{
    fn: "dropTable",
    params: ["ArtistsAndBands"]
  },
  {
    fn: "dropTable",
    params: ["ArtistsRelated"]
  },
  {
    fn: "dropTable",
    params: ["Productions"]
  },
  {
    fn: "dropTable",
    params: ["ViewsHistory"]
  },
  {
    fn: "dropTable",
    params: ["Artists"]
  },
  {
    fn: "dropTable",
    params: ["Bands"]
  },
  {
    fn: "dropTable",
    params: ["FavoriteVideos"]
  },
  {
    fn: "dropTable",
    params: ["Videos"] 
  },
  {
    fn: "dropTable",
    params: ["Users"]
  },
  {
    fn: "dropTable",
    params: ["Channels"]
  },
  {
    fn: "dropTable",
    params: ["Genres"]
  },
];

module.exports = {
  pos: 0,
  up: function (queryInterface, Sequelize) {
    var index = this.pos;
    return new Promise(function (resolve, reject) {
      function next() {
        if (index < migrationCommands.length) {
          let command = migrationCommands[index];
          console.log("[#" + index + "] execute: " + command.fn);
          index++;
          queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
        } else
          resolve();
      }
      next();
    });
  },
  info: info
};