
const Sequelize = require('sequelize');

var myORM = require('../../ORM/ORM.js');
const ORM = new myORM();

const Prova = require("./Prova.js");

const Pippo = ORM.sequelize.define('pippo', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  uno: {
    type: Sequelize.INTEGER
  },
  due: {
    type: Sequelize.INTEGER
  },
  tre: {
    type: Sequelize.INTEGER
  },
  FKProvasId: {
    type: Sequelize.INTEGER,
    references: 'provas', // <<< Note, its table's name, not object name
    referencesKey: 'id' // <<< Note, its a column name
  }
});

// Pippo.belongsTo(Prova, {as: 'FkProvas' });

Pippo.belongsTo(Prova, {foreignKey:'FKProvasId', as:'AliasForProvaRelation'});

module.exports = Pippo;