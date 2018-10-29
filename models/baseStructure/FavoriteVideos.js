/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FavoriteVideos', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKVideoId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Videos',
        key: 'id'
      }
    },
    FKUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Users',
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
    tableName: 'FavoriteVideos'
  });
};
