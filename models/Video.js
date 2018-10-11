////////////////////////////////////////////////////////////////////////////////
// import ORM instance and Datatypes
const Sequelize = require('sequelize');
var myORM = require('../libraries/ORM.js');
const ORM = new myORM();
const DataTypes = Sequelize.DataTypes;
////////////////////////////////////////////////////////////////////////////////
// import main model
var Video = require("./baseStructure/Videos.js")(ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// import additional models (for define relations)
var User = require("./baseStructure/Users.js")(ORM.sequelize, DataTypes);
var Channel = require("./baseStructure/Channels.js")(ORM.sequelize, DataTypes);
var Playlist = require("./baseStructure/Playlists.js")(ORM.sequelize, DataTypes);
var PlaylistsAndVideos = require("./baseStructure/PlaylistsAndVideos.js")(ORM.sequelize, DataTypes);
var FavoriteVideos = require("./baseStructure/FavoriteVideos.js")(ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// define relation
Video.belongsTo(Channel, {
  foreignKey: 'FKChannelId'
});
// define relation
Video.belongsToMany(Playlist, {
  through: PlaylistsAndVideos,
  foreignKey: 'FKVideoId',
  otherKey: 'FKPlaylistId'
});
// define relation
Video.belongsToMany(User, {
  through: FavoriteVideos,
  foreignKey: 'FKVideoId',
  otherKey: 'FKUserId'
});
////////////////////////////////////////////////////////////////////////////////
// export model with structure and relations
module.exports = Video;
////////////////////////////////////////////////////////////////////////////////