
// import ORM instance and Datatypes
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

// import main model
var Channel = require("./baseStructure/Channels.js")(global.ORM.sequelize, DataTypes)

// import additional models (for define relations)
var Video = require("./baseStructure/Videos.js")(global.ORM.sequelize, DataTypes)

// define relation
Channel.hasMany(Video, {
  foreignKey: 'FKChannelId',
  sourceKey: 'id'
})

// export model with structure and relations
module.exports = Channel
