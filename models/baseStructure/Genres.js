/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Genres', {
    id: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      unique: true
    }
  }, {
    tableName: 'Genres'
  });
};
