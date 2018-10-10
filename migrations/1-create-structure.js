'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Logs", deps: []
 * createTable "Artists", deps: []
 * createTable "Bands", deps: []
 * createTable "Channels", deps: []
 * createTable "Users", deps: []
 * createTable "ArtistsAndBands", deps: [Artists, Bands]
 * createTable "Playlists", deps: [Users]
 * createTable "Videos", deps: [Channels]
 * createTable "PlaylistsAndVideos", deps: [Playlists, Videos]
 * createTable "Productions", deps: [Bands, Videos]
 * createTable "FavoriteVideos", deps: [Videos, Users]
 *
 **/

var info = {
    "revision": 1,
    "name": "create-structure",
    "created": "2018-09-08T17:14:52.689Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "createTable",
        params: [
            "Logs",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Artists",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": "VARCHAR(255)",
                    "allowNull": true
                },
                "age": {
                    "type": "INTEGER(11)",
                    "allowNull": true
                },
                "sex": {
                    "type": "ENUM('M', 'F')",
                    "allowNull": true
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Bands",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "",
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Channels",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "name": {
                    "type": "VARCHAR(11)",
                    "allowNull": true
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Users",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "ArtistsAndBands",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "FKArtistId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Artists",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "FKBandId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Bands",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Playlists",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "createdAt": {
                    "type": "INTEGER(11)",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "INTEGER(11)",
                    "allowNull": true
                },
                "FKUserId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Videos",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": "VARCHAR(11)",
                    "allowNull": true
                },
                "description": {
                    "type": "VARCHAR(11)",
                    "allowNull": true
                },
                "FKChannelId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Channels",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "PlaylistsAndVideos",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "FKPlaylistId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Playlists",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "FKVideoId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Videos",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Productions",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "FKBandId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Bands",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "FKVideoId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Videos",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "FavoriteVideos",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "FKVideoId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Videos",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "FKUserId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Users",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                }
            },
            {}
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
