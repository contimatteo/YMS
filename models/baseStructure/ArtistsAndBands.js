/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ArtistsAndBands', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKArtistId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Artists',
        key: 'id'
      }
    },
    FKBandId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Artists',
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
    tableName: 'ArtistsAndBands'
  });
};
