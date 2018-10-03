'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "artists_number" to table "Bands"
 *
 **/

var info = {
    "revision": 3,
    "name": "testing",
    "created": "2018-10-03T13:15:47.757Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "Bands",
        "artists_number",
        {
            "type": "INTEGER(11)",
            "allowNull": false
        }
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
