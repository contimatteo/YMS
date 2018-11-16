/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ArtistsRelated', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKArtist1Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      }
    },
    FKArtist2Id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      }
    }
  }, {
    tableName: 'ArtistsRelated'
  });
};
