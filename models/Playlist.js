////////////////////////////////////////////////////////////////////////////////
// import ORM instance and Datatypes
const Sequelize = require('sequelize');
var myORM = require('../libraries/ORM.js');
const ORM = new myORM();
const DataTypes = Sequelize.DataTypes;
////////////////////////////////////////////////////////////////////////////////
// import main model
var Playlist = require("./baseStructure/Playlists.js")(ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// import additional models (for define relations)
var User = require("./baseStructure/Users.js")(ORM.sequelize, DataTypes);
var Video = require("./baseStructure/Videos.js")(ORM.sequelize, DataTypes);
var PlaylistsAndVideos = require("./baseStructure/PlaylistsAndVideos.js")(ORM.sequelize, DataTypes);
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