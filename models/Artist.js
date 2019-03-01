// import ORM instance and Datatypes
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes;

// import main model
var Artist = require("./baseStructure/Artists.js")(global.ORM.sequelize, DataTypes)

// import additional models (for define relations)
var Productions = require("./baseStructure/Productions.js")(global.ORM.sequelize, DataTypes)
var Video = require("./baseStructure/Videos.js")(global.ORM.sequelize, DataTypes)
var ArtistsAndBands = require("./baseStructure/ArtistsAndBands.js")(global.ORM.sequelize, DataTypes)
var ArtistsRelated = require("./baseStructure/ArtistsRelated.js")(global.ORM.sequelize, DataTypes)

// define relation
Artist.belongsToMany(Artist, {
  through: ArtistsAndBands,
  foreignKey: 'FKBandId',
  otherKey: 'FKArtistId',
  as: 'BandMembers'
})

// define relation
Artist.belongsToMany(Artist, {
  through: ArtistsRelated,
  foreignKey: 'FKArtist1Id',
  otherKey: 'FKArtist2Id',
  as: 'Related'
})

// define relation
Artist.belongsToMany(Video, {
  through: Productions,
  foreignKey: 'FKMusicianId',
  otherKey: 'FKVideoId'
})

// export model with structure and relations
module.exports = Artist