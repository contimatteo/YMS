/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Bands', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    }
  }, {
    tableName: 'Bands'
  });
};
