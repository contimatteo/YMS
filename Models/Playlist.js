////////////////////////////////////////////////////////////////////////////////
// import ORM instance and Datatypes
const Sequelize = require('sequelize');
var myORM = require('../Libraries/ORM.js');
const ORM = new myORM();
const DataTypes = Sequelize.DataTypes;
////////////////////////////////////////////////////////////////////////////////
// import main model
var Playlist = require("./BaseStructure/Playlists.js")(ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// import additional models (for define relations)
var User = require("./BaseStructure/Users.js")(ORM.sequelize, DataTypes);
var Video = require("./BaseStructure/Videos.js")(ORM.sequelize, DataTypes);
var PlaylistsAndVideos = require("./BaseStructure/PlaylistsAndVideos.js")(ORM.sequelize, DataTypes);
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