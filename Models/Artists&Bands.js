/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Artists&Bands', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKArtistId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      }
    },
    FKBandId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Bands',
        key: 'id'
      }
    }
  }, {
    tableName: 'Artists&Bands'
  });
};
