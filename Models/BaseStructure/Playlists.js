/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Playlists', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true
    },
    createdAt: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    },
    FKUserId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    tableName: 'Playlists'
  });
};
