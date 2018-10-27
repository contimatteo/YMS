'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "url" to table "Bands"
 * changeColumn "url" on table "Artists"
 * changeColumn "url" on table "Artists"
 *
 **/

var info = {
    "revision": 5,
    "name": "sparql",
    "created": "2018-10-26T14:52:24.478Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "Bands",
            "url",
            {
                "type": VARCHAR(255),
                "unique": true,
                "defaultValue": "",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "url",
            {
                "type": VARCHAR(255),
                "unique": true,
                "defaultValue": "",
                "allowNull": false
            }
        ]
    },
    {
        fn: "changeColumn",
        params: [
            "Artists",
            "url",
            {
                "type": VARCHAR(255),
                "unique": true,
                "defaultValue": "",
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
