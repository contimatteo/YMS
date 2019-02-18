// import ORM instance and Datatypes
const Sequelize = require('sequelize')
const DataTypes = Sequelize.DataTypes

// import main model
var User = require("./baseStructure/Users.js")(global.ORM.sequelize, DataTypes)

// import additional models (for define relations)
var Video = require("./baseStructure/Videos.js")(global.ORM.sequelize, DataTypes)
var ViewsHistory = require("./baseStructure/ViewsHistory.js")(global.ORM.sequelize, DataTypes)

// define relation
// User.belongsToMany(Video, {
//   through: ViewsHistory,
//   foreignKey: 'FKUserId',
//   otherKey: 'FKVideoId',
//   as: "ViewsHistory"
// })

// export model with structure and relations
module.exports = User