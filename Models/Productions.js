/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Productions', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKBandId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Bands',
        key: 'id'
      }
    },
    FKVideoId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Videos',
        key: 'id'
      }
    }
  }, {
    tableName: 'Productions'
  });
};
