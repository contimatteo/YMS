/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('prova', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING(11),
      allowNull: true
    }
  }, {
    tableName: 'prova'
  });
};
