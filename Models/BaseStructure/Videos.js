/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Videos', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    FKChannelId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Channels',
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
    tableName: 'Videos'
  });
};
