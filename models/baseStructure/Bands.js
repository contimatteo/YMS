/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Bands', {
    id: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    members_number: {
      type: DataTypes.INTEGER(11),
      allowNull: false
    },
    url: {
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: '',
      unique: true
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    type: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    formatted_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    tableName: 'Bands'
  });
};
