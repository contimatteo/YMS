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
    "name": "noname",
    "created": "2018-10-10T08:39:15.347Z",
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
