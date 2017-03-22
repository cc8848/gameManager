var server = require('../index')
var jsonres = require('../../libs/jsonres')
var request = require('request')
var config = require('../../config')

server.get('/api/userlist',function(req,res){
    request({
        url: config.remote_server + '/pk-web/user/list',
        json: true,
        method: 'GET',
    },function(err,httpResponse,body) {
        if (!!!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})
