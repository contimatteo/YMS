const Sequelize = require('sequelize');

var myORM = require('../Libraries/ORM.js');
const ORM = new myORM();


const Prova = ORM.sequelize.define('prova', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  nome: {
    type: Sequelize.STRING
  }
}, {
  tableName: 'provas'
});

module.exports = Prova;