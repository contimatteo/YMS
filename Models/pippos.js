/* jshint indent: 2 */

const Prova = require("./provas.js");

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pippos', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uno: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    due: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    tre: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    FKProvasId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'provas',
        key: 'id'
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'pippos',
    classMethods: {
      associate: function(models) {
        this.hasMany(models.Prova);
      }
    }
  });
};

