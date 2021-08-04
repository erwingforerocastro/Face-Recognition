const path = require('path');


const UNKNOWS_URL = path.join(__dirname, '/../unknows_url');
const ACQUAINTANCES_URL = path.join(__dirname, '/../acquaintances_url');
const MODELS_URL = path.join(__dirname, '/mvfy/models');
const CONFIG_URL = path.join(__dirname, '/../config');
const PORT = process.env.PORT || 3000;

module.exports = {
    UNKNOWS_URL,
    ACQUAINTANCES_URL,
    MODELS_URL,
    CONFIG_URL,
    PORT
}