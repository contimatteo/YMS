'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * changeColumn "id" on table "Logs"
 * changeColumn "id" on table "Artists"
 * changeColumn "name" on table "Artists"
 * changeColumn "age" on table "Artists"
 * changeColumn "sex" on table "Artists"
 * changeColumn "createdAt" on table "Artists"
 * changeColumn "updatedAt" on table "Artists"
 * changeColumn "id" on table "ArtistsAndBands"
 * changeColumn "id" on table "ArtistsAndBands"
 * changeColumn "FKArtistId" on table "ArtistsAndBands"
 * changeColumn "FKBandId" on table "ArtistsAndBands"
 * changeColumn "createdAt" on table "ArtistsAndBands"
 * changeColumn "updatedAt" on table "ArtistsAndBands"
 * changeColumn "id" on table "Bands"
 * changeColumn "id" on table "Bands"
 * changeColumn "name" on table "Bands"
 * changeColumn "createdAt" on table "Bands"
 * changeColumn "updatedAt" on table "Bands"
 * changeColumn "id" on table "Channels"
 * changeColumn "id" on table "Channels"
 * changeColumn "name" on table "Channels"
 * changeColumn "createdAt" on table "Channels"
 * changeColumn "updatedAt" on table "Channels"
 * changeColumn "id" on table "FavoriteVideos"
 * changeColumn "id" on table "FavoriteVideos"
 * changeColumn "FKVideoId" on table "FavoriteVideos"
 * changeColumn "FKUserId" on table "FavoriteVideos"
 * changeColumn "createdAt" on table "FavoriteVideos"
 * changeColumn "updatedAt" on table "FavoriteVideos"
 * changeColumn "id" on table "Logs"
 * changeColumn "id" on table "Artists"
 * changeColumn "createdAt" on table "Logs"
 * changeColumn "updatedAt" on table "Logs"
 * changeColumn "id" on table "Playlists"
 * changeColumn "id" on table "Playlists"
 * changeColumn "createdAt" on table "Playlists"
 * changeColumn "updatedAt" on table "Playlists"
 * changeColumn "FKUserId" on table "Playlists"
 * changeColumn "id" on table "PlaylistsAndVideos"
 * changeColumn "id" on table "PlaylistsAndVideos"
 * changeColumn "FKPlaylistId" on table "PlaylistsAndVideos"
 * changeColumn "FKVideoId" on table "PlaylistsAndVideos"
 * changeColumn "createdAt" on table "PlaylistsAndVideos"
 * changeColumn "updatedAt" on table "PlaylistsAndVideos"
 * changeColumn "id" on table "Productions"
 * changeColumn "id" on table "Productions"
 * changeColumn "FKBandId" on table "Productions"
 * changeColumn "FKVideoId" on table "Productions"
 * changeColumn "createdAt" on table "Productions"
 * changeColumn "updatedAt" on table "Productions"
 * changeColumn "id" on table "Users"
 * changeColumn "id" on table "Users"
 * changeColumn "createdAt" on table "Users"
 * changeColumn "updatedAt" on table "Users"
 * changeColumn "id" on table "Videos"
 * changeColumn "id" on table "Videos"
 * changeColumn "title" on table "Videos"
 * changeColumn "description" on table "Videos"
 * changeColumn "FKChannelId" on table "Videos"
 * changeColumn "createdAt" on table "Videos"
 * changeColumn "updatedAt" on table "Videos"
 *
 **/

var info = {
    "revision": 4,
    "name": "test",
    "created": "2018-09-08T14:58:46.099Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "changeColumn",
        params: [
            "Logs",
            "id",
            {
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.STRING(255),
                "allowNull": true
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "age",
            {
                "type": Sequelize.INTEGER(11),
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
                "type": Sequelize.ENUM('M', 'F'),
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.STRING(255),
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.STRING(11),
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Logs",
            "createdAt",
            {
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
                "primaryKey": true,
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Playlists",
            "id",
            {
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11),
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
                "type": Sequelize.INTEGER(11),
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.STRING(11),
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
                "type": Sequelize.STRING(11),
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
                "type": Sequelize.INTEGER(11).UNSIGNED,
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
                "type": Sequelize.DATE,
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
                "type": Sequelize.DATE,
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
