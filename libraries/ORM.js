var config = require('../config/config.json');
const Sequelize = require('sequelize');


module.exports = class myORM {

  constructor() {
    this.sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
      host: config.development.host,
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

  }

  isConnected(nextFunction) {
    this.sequelize.authenticate().then(() => {
        // Connection has been established successfully
        nextFunction(true);
      })
      .catch(err => {
        // Unable to connect to the database
        nextFunction(false);
      });
  }

  sync() {
    this.sequelize.sync()
      .then(err => {
        // Connection has been established successfully
      })
      .catch(err => {
        // Unable to connect to the database
      });
  }

}