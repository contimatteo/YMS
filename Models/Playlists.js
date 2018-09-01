/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Playlists', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    }
  }, {
    tableName: 'Playlists'
  });
};
