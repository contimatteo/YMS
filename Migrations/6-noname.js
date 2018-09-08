'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "createdAt" on table "Logs"
 * changeColumn "id" on table "Artists"
 * changeColumn "age" on table "Artists"
 * changeColumn "sex" on table "Artists"
 * changeColumn "createdAt" on table "Artists"
 * changeColumn "updatedAt" on table "Artists"
 * changeColumn "id" on table "ArtistsAndBands"
 * changeColumn "FKArtistId" on table "ArtistsAndBands"
 * changeColumn "FKBandId" on table "ArtistsAndBands"
 * changeColumn "createdAt" on table "ArtistsAndBands"
 * changeColumn "updatedAt" on table "ArtistsAndBands"
 * changeColumn "id" on table "Bands"
 * changeColumn "name" on table "Bands"
 * changeColumn "createdAt" on table "Bands"
 * changeColumn "updatedAt" on table "Bands"
 * changeColumn "id" on table "Channels"
 * changeColumn "name" on table "Channels"
 * changeColumn "createdAt" on table "Channels"
 * changeColumn "updatedAt" on table "Channels"
 * changeColumn "id" on table "FavoriteVideos"
 * changeColumn "FKVideoId" on table "FavoriteVideos"
 * changeColumn "FKUserId" on table "FavoriteVideos"
 * changeColumn "createdAt" on table "FavoriteVideos"
 * changeColumn "updatedAt" on table "FavoriteVideos"
 * changeColumn "id" on table "Logs"
 * changeColumn "name" on table "Artists"
 * changeColumn "updatedAt" on table "Logs"
 * changeColumn "id" on table "Playlists"
 * changeColumn "createdAt" on table "Playlists"
 * changeColumn "updatedAt" on table "Playlists"
 * changeColumn "FKUserId" on table "Playlists"
 * changeColumn "id" on table "PlaylistsAndVideos"
 * changeColumn "FKPlaylistId" on table "PlaylistsAndVideos"
 * changeColumn "FKVideoId" on table "PlaylistsAndVideos"
 * changeColumn "createdAt" on table "PlaylistsAndVideos"
 * changeColumn "updatedAt" on table "PlaylistsAndVideos"
 * changeColumn "id" on table "Productions"
 * changeColumn "FKBandId" on table "Productions"
 * changeColumn "FKVideoId" on table "Productions"
 * changeColumn "createdAt" on table "Productions"
 * changeColumn "updatedAt" on table "Productions"
 * changeColumn "id" on table "Users"
 * changeColumn "createdAt" on table "Users"
 * changeColumn "updatedAt" on table "Users"
 * changeColumn "test" on table "Users"
 * changeColumn "id" on table "Videos"
 * changeColumn "title" on table "Videos"
 * changeColumn "description" on table "Videos"
 * changeColumn "FKChannelId" on table "Videos"
 * changeColumn "createdAt" on table "Videos"
 * changeColumn "updatedAt" on table "Videos"
 *
 **/

var info = {
    "revision": 6,
    "name": "noname",
    "created": "2018-09-08T15:12:02.856Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "Logs",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "age",
            {
                "type": INTEGER(11),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "sex",
            {
                "type": ENUM('M', 'F'),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "ArtistsAndBands",
            "FKArtistId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Artists",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "ArtistsAndBands",
            "FKBandId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Bands",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "ArtistsAndBands",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "ArtistsAndBands",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Bands",
            "name",
            {
                "type": VARCHAR(255),
                "defaultValue": "",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Bands",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Bands",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Channels",
            "name",
            {
                "type": VARCHAR(11),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Channels",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Channels",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FavoriteVideos",
            "FKVideoId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Videos",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FavoriteVideos",
            "FKUserId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Users",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FavoriteVideos",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "FavoriteVideos",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "name",
            {
                "type": VARCHAR(255),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Logs",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Playlists",
            "id",
            {
                "type": INTEGER(11) UNSIGNED,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Playlists",
            "createdAt",
            {
                "type": INTEGER(11),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Playlists",
            "updatedAt",
            {
                "type": INTEGER(11),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Playlists",
            "FKUserId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Users",
                    "key": "id"
                },
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "PlaylistsAndVideos",
            "FKPlaylistId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Playlists",
                    "key": "id"
                },
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "PlaylistsAndVideos",
            "FKVideoId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Videos",
                    "key": "id"
                },
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "PlaylistsAndVideos",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "PlaylistsAndVideos",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Productions",
            "FKBandId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Bands",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Productions",
            "FKVideoId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Videos",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Productions",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Productions",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Users",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Users",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Users",
            "test",
            {
                "type": INTEGER(11),
                "allowNull": true
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
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Videos",
            "title",
            {
                "type": VARCHAR(11),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Videos",
            "description",
            {
                "type": VARCHAR(11),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Videos",
            "FKChannelId",
            {
                "type": INTEGER(11) UNSIGNED,
                "references": {
                    "model": "Channels",
                    "key": "id"
                },
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Videos",
            "createdAt",
            {
                "type": DATETIME,
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Videos",
            "updatedAt",
            {
                "type": DATETIME,
                "allowNull": true
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
