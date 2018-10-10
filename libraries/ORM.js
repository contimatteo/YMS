
require('dotenv').config({
  path: __dirname + '/.env'
});
const Sequelize = require('sequelize');

module.exports = class myORM {
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  constructor() {
    console.log("Sequelize host --> " + process.env.DB_HOST);
    this.sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USER, process.env.DB_PASSWORD, {
      host: process.env.DB_HOST,
      dialect: 'mysql',
      operatorsAliases: false,
      pool: {
        max: 15,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      // disable logging; default: console.log
      logging: false
    });
    // this.sync();
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  isConnected(nextFunction) {
    this.sequelize.authenticate().then(() => {
        //console.log('Connection has been established successfully.');
        nextFunction(true);
      })
      .catch(err => {
        //console.error('Unable to connect to the database:', err);
        nextFunction(false);
      });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  sync() {
    this.sequelize.sync()
      .then(err => {
        // console.log('Connection has been established successfully.');
      })
      .catch(err => {
        // console.error('Unable to connect to the database:', err);
      });
  }
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
}