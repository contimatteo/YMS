////////////////////////////////////////////////////////////////////////////////
// import ORM instance and Datatypes
const Sequelize = require('sequelize');
const DataTypes = Sequelize.DataTypes;
////////////////////////////////////////////////////////////////////////////////
// import main model
var Playlist = require("./baseStructure/Playlists.js")(global.ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// import additional models (for define relations)
var User = require("./baseStructure/Users.js")(global.ORM.sequelize, DataTypes);
var Video = require("./baseStructure/Videos.js")(global.ORM.sequelize, DataTypes);
var PlaylistsAndVideos = require("./baseStructure/PlaylistsAndVideos.js")(global.ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// define relation
Playlist.belongsTo(User, {
  foreignKey: 'FKUserId'
});
// define relation
Playlist.belongsToMany(Video, {
  through: PlaylistsAndVideos,
  foreignKey: 'FKPlaylistId',
  otherKey: 'FKVideoId'
});
////////////////////////////////////////////////////////////////////////////////
// export model with structure and relations
module.exports = Playlist;
////////////////////////////////////////////////////////////////////////////////