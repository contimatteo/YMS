'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "lastname" to table "Users"
 * addColumn "firstname" to table "Users"
 * addColumn "email" to table "Users"
 * addColumn "password" to table "Users"
 *
 **/

var info = {
    "revision": 2,
    "name": "dump-alpha-version",
    "created": "2018-09-25T06:55:10.829Z",
    "comment": ""
};

var migrationCommands = [{
        fn: "addColumn",
        params: [
            "Users",
            "lastname",
            {
                "type": "VARCHAR(150)",
                "allowNull": true
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Users",
            "firstname",
            {
                "type": "VARCHAR(150)",
                "allowNull": true
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Users",
            "email",
            {
                "type": "VARCHAR(150)",
                "unique": true,
                "defaultValue": "",
                "allowNull": false
            }
        ]
    },
    {
        fn: "addColumn",
        params: [
            "Users",
            "password",
            {
                "type": "VARCHAR(255)",
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
