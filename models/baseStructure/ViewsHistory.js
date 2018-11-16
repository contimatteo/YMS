/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ViewsHistory', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    startFKVideoId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      references: {
        model: 'Videos',
        key: 'id'
      }
    },
    endFKVideoId: {
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
    views: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
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
