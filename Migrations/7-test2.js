'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "test" from table "Users"
 * changeColumn "id" on table "Playlists"
 * changeColumn "id" on table "Bands"
 * changeColumn "id" on table "Channels"
 * changeColumn "id" on table "FavoriteVideos"
 * changeColumn "id" on table "Logs"
 * changeColumn "id" on table "ArtistsAndBands"
 * changeColumn "id" on table "PlaylistsAndVideos"
 * changeColumn "id" on table "Productions"
 * changeColumn "id" on table "Users"
 * changeColumn "id" on table "Artists"
 * changeColumn "id" on table "Videos"
 *
 **/

var info = {
    "revision": 7,
    "name": "test2",
    "created": "2018-09-08T15:13:39.799Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "removeColumn",
        params: ["Users", "test"]
    },
    {
        fn: "changeColumn",
        params: [
            "Playlists",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Bands",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Channels",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FavoriteVideos",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Logs",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "ArtistsAndBands",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "PlaylistsAndVideos",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Productions",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Users",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Videos",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    }
];

module.exports = {
    pos: 0,
    up: function(queryInterface, Sequelize)
    {
        var index = this.pos;
        return new Promise(function(resolve, reject) {
            function next() {
                if (index < migrationCommands.length)
                {
                    let command = migrationCommands[index];
                    console.log("[#"+index+"] execute: " + command.fn);
                    index++;
                    queryInterface[command.fn].apply(queryInterface, command.params).then(next, reject);
                }
                else
                    resolve();
            }
            next();
        });
    },
    info: info
};
