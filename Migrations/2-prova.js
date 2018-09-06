'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * createTable "daEliminare", deps: []
 *
 **/

var info = {
    "revision": 2,
    "name": "prova",
    "created": "2018-09-06T15:05:33.409Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "createTable",
    params: [
        "daEliminare",
        {
            "id": {
                "type": "INTEGER(11) UNSIGNED",
                "autoIncrement": true,
                "primaryKey": true,
                "allowNull": false
            },
            "temp": {
                "type": "INTEGER(11)",
                "allowNull": true
            },
            "createdAt": {
                "type": "DATETIME",
                "allowNull": false
            },
            "updatedAt": {
                "type": "DATETIME",
                "allowNull": false
            }
        },
        {}
    ]
}];

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
