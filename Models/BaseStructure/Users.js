/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Users', {
    id: {
      type: DataTypes.INTEGER(11),
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
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    email: {
      type: DataTypes.STRING(150),
      allowNull: false,
      defaultValue: '',
      unique: true
    },
    firstname: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    lastname: {
      type: DataTypes.STRING(150),
      allowNull: true
    }
  }, {
    tableName: 'Users'
  });
};
