/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ViewsHistory', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    FKVideoId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    FKUserId: {
      type: DataTypes.INTEGER(11),
      allowNull: false
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
    tableName: 'ViewsHistory'
  });
};
