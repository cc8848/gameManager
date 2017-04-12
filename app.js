const config = require('./config')
var server = require('./server')

require('./server/api/match')
require('./server/api/template')
require('./server/api/upload')
require('./server/api/recharge')

require('./server/api/user/login')
require('./server/api/user/state')

server.listen(config.dev_server_port, function() {
  console.log('listening at %s', config.dev_server_port);
});
