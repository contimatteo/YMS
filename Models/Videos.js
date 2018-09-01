/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Videos', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKChannelId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      references: {
        model: 'Channels',
        key: 'id'
      }
    }
  }, {
    tableName: 'Videos'
  });
};
