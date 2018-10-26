'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * removeColumn "sex" from table "Artists"
 * removeColumn "age" from table "Artists"
 * removeColumn "name" from table "Artists"
 * removeColumn "artists_number" from table "Bands"
 * addColumn "lastname" to table "Artists"
 * addColumn "url" to table "Artists"
 * addColumn "firstname" to table "Artists"
 * addColumn "members_number" to table "Bands"
 *
 **/

var info = {
    "revision": 4,
    "name": "noname",
    "created": "2018-10-26T08:14:42.643Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "removeColumn",
        params: ["Artists", "sex"]
    },
    {
        fn: "removeColumn",
        params: ["Artists", "age"]
    },
    {
        fn: "removeColumn",
        params: ["Artists", "name"]
    },
    {
        fn: "removeColumn",
        params: ["Bands", "artists_number"]
    },
    {
        fn: "addColumn",
        params: [
            "Artists",
            "lastname",
            {
                "type": "VARCHAR(11)",
                "allowNull": true
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Artists",
            "url",
            {
                "type": "VARCHAR(255)",
                "unique": true,
                "allowNull": true
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Artists",
            "firstname",
            {
                "type": "VARCHAR(255)",
                "allowNull": true
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Bands",
            "members_number",
            {
                "type": "INTEGER(11)",
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
