// import ORM instance and Datatypes
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

// import main model
var Video = require("./baseStructure/Videos.js")(global.ORM.sequelize, DataTypes)

// import additional models (for define relations)
var Artist = require("./baseStructure/Artists.js")(global.ORM.sequelize, DataTypes)
var User = require("./baseStructure/Users.js")(global.ORM.sequelize, DataTypes)
var Channel = require("./baseStructure/Channels.js")(global.ORM.sequelize, DataTypes)
var Genre = require("./baseStructure/Genres.js")(global.ORM.sequelize, DataTypes)
var ViewsHistory = require("./baseStructure/ViewsHistory.js")(global.ORM.sequelize, DataTypes)
var Productions = require("./baseStructure/Productions.js")(global.ORM.sequelize, DataTypes)

// define relation
Video.belongsTo(Channel, {
  foreignKey: 'FKChannelId'
})
// define relation
Video.belongsTo(Genre, {
  foreignKey: 'FKGenreId'
})
// define relation
Video.belongsToMany(User, {
  through: ViewsHistory,
  foreignKey: 'FKVideoId',
  otherKey: 'FKUserId'
})
// define relation
Video.belongsToMany(Artist, {
  through: Productions,
  foreignKey: 'FKVideoId',
  otherKey: 'FKMusicianId'
})


// export model with structure and relations
module.exports = Video