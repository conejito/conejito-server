const {Wit, log, interactive} = require('node-wit');
const secret = require('../helpers/secret');

module.exports = new Wit({
  accessToken: secret['wit-ai']['accessToken'],
  //logger: new log.Logger(log.DEBUG)
});