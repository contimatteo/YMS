////////////////////////////////////////////////////////////////////////////////
// import ORM instance and Datatypes
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
////////////////////////////////////////////////////////////////////////////////
// import main model
var Video = require("./baseStructure/Videos.js")(global.ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// import additional models (for define relations)
var User = require("./baseStructure/Users.js")(global.ORM.sequelize, DataTypes);
var Channel = require("./baseStructure/Channels.js")(global.ORM.sequelize, DataTypes);
var Playlist = require("./baseStructure/Playlists.js")(global.ORM.sequelize, DataTypes);
var PlaylistsAndVideos = require("./baseStructure/PlaylistsAndVideos.js")(global.ORM.sequelize, DataTypes);
var FavoriteVideos = require("./baseStructure/FavoriteVideos.js")(global.ORM.sequelize, DataTypes);
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