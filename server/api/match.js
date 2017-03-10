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

server.post('/api/table/delete',function(req,res){
    var bodyText = JSON.stringify({
        tableId: req.body.id
    })
    request({
        url: config.remote_server + '/pk-web/sng/table/delete',
        json: true,
        method: 'POST',
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        res.send(jsonres(200,'success',body || []))
    });
})