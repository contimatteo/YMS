
const Sequelize = require('sequelize');

var myORM = require('../../ORM/ORM.js');
const ORM = new myORM();

const Pippo = require('./Pippo.js');

const Prova = ORM.sequelize.define('prova', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: Sequelize.STRING
  }
});

module.exports = Prova;