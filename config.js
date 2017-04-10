var fs = require('fs');

var config = {};

try {
    fs.readFileSync('./localconfig.json');
    config = require('./localconfig.json');    
} catch (e) {
    config = require('./config.json');
}

module.exports = config;