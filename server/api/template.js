var server = require('../index')
// var db = require('../../db/connect')
var jsonres = require('../../libs/jsonres')
var request = require('request')
var config = require('../../config')

server.get('/api/templates',function(req,res){
    request({
        url: config.remote_server + '/pk-web/sng/temp/list',
        json: true,
        method: 'GET',
    },function(err,httpResponse,body) {
        res.send(jsonres(200,'success',body.data || []))
    });
})

server.post('/api/sng/create',function(req,res){
    var bodyText = JSON.stringify(req.body)
    console.log(bodyText)
    request({
        url: config.remote_server + '/pk-web/sng/temp/add',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        res.send(jsonres(200,'success',body.data || []))
    });
})

server.post('/api/table/create',function(req,res){
    var bodyText = JSON.stringify(req.body)
    request({
        url: config.remote_server + '/pk-web/sng/table/add',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        res.send(jsonres(200,'success',body.data || []))
    });
})

server.post('/api/prize/create',function(req,res){
    var bodyText = JSON.stringify(req.body)
    request({
        url: config.remote_server + '/pk-web/prize/create',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        res.send(jsonres(200,'success',body.data || []))
    });
})

server.get('/api/prize/list',function(req,res){
    request({
        url: config.remote_server + '/pk-web/prize/list',
        json: true,
    },function(err,httpResponse,body) {
        res.send(jsonres(200,'success',body.data || []))
    });
})
// 