const Sequelize = require('sequelize');

const secret = require('../helpers/secret');

const sequelize = new Sequelize('conejito', secret.mysql.username, secret.mysql.password || null, {
  host: 'localhost',
  port: 3306,
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },

  logging: false,
  operatorsAliases: false
});

module.exports = sequelize