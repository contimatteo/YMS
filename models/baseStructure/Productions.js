/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Productions', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKMusicianId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Bands',
        key: 'id'
      }
    },
    FKVideoId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
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
    tableName: 'Productions'
  });
};
