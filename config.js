require('dotenv').config();
var config = {};
config.port = process.env.PORT || '3000';
config.VERIFICATION_TOKEN = process.env.VERIFICATION_TOKEN;
config.dir = process.env.DIR || './'

module.exports = config;