
// import ORM instance and Datatypes
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

// import main model
var Productions = require("./baseStructure/Productions.js")(global.ORM.sequelize, DataTypes)

// export model with structure and relations
module.exports = Productions
