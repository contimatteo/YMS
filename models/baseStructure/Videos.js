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
      type: DataTypes.STRING(255),
      allowNull: false,
      defaultValue: ''
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    FKChannelId: {
      type: DataTypes.INTEGER(11),
      allowNull: true,
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
    },
    views: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      defaultValue: '0'
    },
    youtube_id: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: '',
      unique: true
    },
    image_url: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    song_name: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    album: {
      type: DataTypes.STRING(255),
      allowNull: true,
      defaultValue: ''
    },
    FKGenreId: {
      type: DataTypes.INTEGER(11).UNSIGNED,
      allowNull: true,
      references: {
        model: 'Genres',
        key: 'id'
      }
    },
    dbpedia_abstract: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'Videos'
  });
};
