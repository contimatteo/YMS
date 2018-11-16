/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Channels', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    youtube_id: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    }
  }, {
    tableName: 'Channels'
  });
};
