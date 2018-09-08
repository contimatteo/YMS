/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PlaylistsAndVideos', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKPlaylistId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Playlists',
        key: 'id'
      }
    },
    FKVideoId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Videos',
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
    tableName: 'PlaylistsAndVideos'
  });
};
