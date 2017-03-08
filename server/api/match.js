var server = require('../index')
var jsonres = require('../../libs/jsonres')
var request = require('request')
var config = require('../../config')

server.get('/api/matchlist',function(req,res){
    request({
        url: config.remote_server + '/pk-web/sng/table/list',
        json: true,
        method: 'GET',
    },function(err,httpResponse,body) {
        res.send(jsonres(200,'success',body.data || []))
    });
})