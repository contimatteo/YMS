'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * addColumn "test" to table "Users"
 *
 **/

var info = {
    "revision": 5,
    "name": "test2",
    "created": "2018-09-08T15:02:59.060Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "addColumn",
    params: [
        "Users",
        "test",
        {
            "type": Sequelize.INTEGER(11),
            "allowNull": true
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
