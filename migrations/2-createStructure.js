'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "Artists", deps: []
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
    "revision": 2,
    "name": "createStructure",
    "created": "2018-11-28T12:02:12.504Z",
    "comment": ""
};

var migrationCommands = [{
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
                },
                "url": {
                    "type": "VARCHAR(255)",
                    "unique": true,
                    "defaultValue": "",
                    "allowNull": false
                },
                "description": {
                    "type": "TEXT",
                    "allowNull": true
                },
                "dbpedia_type": {
                    "type": "VARCHAR(255)",
                    "allowNull": true
                },
                "type": {
                    "type": "ENUM('', 'artist', 'band')",
                    "defaultValue": "artist",
                    "allowNull": true
                },
                "formatted_name": {
                    "type": "VARCHAR(255)",
                    "unique": true,
                    "defaultValue": "",
                    "allowNull": false
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
                    "type": "VARCHAR(255)",
                    "allowNull": true
                },
                "createdAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "updatedAt": {
                    "type": "DATETIME",
                    "allowNull": true
                },
                "youtube_id": {
                    "type": "VARCHAR(255)",
                    "unique": true,
                    "allowNull": false
                }
            },
            {}
        ]
    },
    {
        fn: "createTable",
        params: [
            "Genres",
            {
                "id": {
                    "type": "INTEGER(11) UNSIGNED",
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
                },
                "name": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "",
                    "allowNull": false
                },
                "url": {
                    "type": "VARCHAR(255)",
                    "unique": true,
                    "defaultValue": "",
                    "allowNull": false
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
                },
                "password": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "",
                    "allowNull": false
                },
                "email": {
                    "type": "VARCHAR(150)",
                    "unique": true,
                    "defaultValue": "",
                    "allowNull": false
                },
                "firstname": {
                    "type": "VARCHAR(150)",
                    "allowNull": true
                },
                "lastname": {
                    "type": "VARCHAR(150)",
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
                        "model": "Artists",
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
            "ArtistsRelated",
            {
                "id": {
                    "type": "INTEGER(11) UNSIGNED",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "FKArtist1Id": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Artists",
                        "key": "id"
                    },
                    "allowNull": false
                },
                "FKArtist2Id": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Artists",
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
            "Videos",
            {
                "id": {
                    "type": "INTEGER(11)",
                    "autoIncrement": true,
                    "primaryKey": true,
                    "allowNull": false
                },
                "title": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "",
                    "allowNull": false
                },
                "description": {
                    "type": "TEXT",
                    "allowNull": true
                },
                "FKChannelId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Channels",
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
                },
                "views": {
                    "type": "INTEGER(11)",
                    "defaultValue": "0",
                    "allowNull": false
                },
                "youtube_id": {
                    "type": "VARCHAR(20)",
                    "unique": true,
                    "defaultValue": "",
                    "allowNull": false
                },
                "image_url": {
                    "type": "TEXT",
                    "allowNull": false
                },
                "song_name": {
                    "type": "VARCHAR(255)",
                    "allowNull": true
                },
                "album": {
                    "type": "VARCHAR(255)",
                    "defaultValue": "",
                    "allowNull": true
                },
                "FKGenreId": {
                    "type": "INTEGER(11) UNSIGNED",
                    "references": {
                        "model": "Genres",
                        "key": "id"
                    },
                    "allowNull": true
                },
                "dbpedia_abstract": {
                    "type": "TEXT",
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
                "FKMusicianId": {
                    "type": "INTEGER(11)",
                    "references": {
                        "model": "Artists",
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
            "ViewsHistory",
            {
                "id": {
                    "type": "INTEGER(11) UNSIGNED",
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
                },
                "complete": {
                    "type": "INTEGER(1)",
                    "defaultValue": "0",
                    "allowNull": false
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
