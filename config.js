var fs = require('fs');

try{
	fs.readFileSync('./localconfig.json')
    config = require('./localconfig.json')
} catch(e){
    config = require('./config.json')
}

module.exports = config;