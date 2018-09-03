////////////////////////////////////////////////////////////////////////////////
// import ORM instance and Datatypes
const Sequelize = require('sequelize');
var myORM = require('../Libraries/ORM.js');
const ORM = new myORM();
const DataTypes = Sequelize.DataTypes;
////////////////////////////////////////////////////////////////////////////////
// import main model
var Video = require("./BaseStructure/Videos.js")(ORM.sequelize, DataTypes);
////////////////////////////////////////////////////////////////////////////////
// import additional models (for define relations)
var User = require("./BaseStructure/Users.js")(ORM.sequelize, DataTypes);
var Channel = require("./BaseStructure/Channels.js")(ORM.sequelize, DataTypes);
var Playlist = require("./BaseStructure/Playlists.js")(ORM.sequelize, DataTypes);
var PlaylistsAndVideos = require("./BaseStructure/PlaylistsAndVideos.js")(ORM.sequelize, DataTypes);
var FavoriteVideos = require("./BaseStructure/FavoriteVideos.js")(ORM.sequelize, DataTypes);
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