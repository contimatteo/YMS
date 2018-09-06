'use strict';

var Sequelize = require('sequelize');

/**
 * Actions summary:
 *
 * dropTable "daEliminare"
 *
 **/

var info = {
    "revision": 3,
    "name": "provaEliminata",
    "created": "2018-09-06T15:06:32.463Z",
    "comment": ""
};

var migrationCommands = [{
    fn: "dropTable",
    params: ["daEliminare"]
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
