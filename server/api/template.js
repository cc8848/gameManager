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
        if (!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})

server.post('/api/sng/create',function(req,res){
    var bodyText = JSON.stringify(req.body)
    request({
        url: config.remote_server + '/pk-web/sng/temp/add',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        if (!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})


server.post('/api/sng/delete',function(req,res){
    var bodyText = JSON.stringify(req.body)
    request({
        url: config.remote_server + '/pk-web/sng/temp/delete',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        if (!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
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
        if (!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})

server.get('/api/table/info',function(req,res){
    var bodyText = req.query.data
    request({
        url: config.remote_server + '/pk-web/sng/temp/info?data='+ bodyText,
        method: 'GET',
        json: true
    },function(err,httpResponse,body) {
        if (!err) {
            res.send(jsonres(200,'success',body.data || {}))
        } else {
            res.send(jsonres(-1,'faild',{}))
        }
    });
})

server.post('/api/table/edit',function(req,res){
    var bodyText = JSON.stringify(req.body)
    request({
        url: config.remote_server + '/pk-web/sng/temp/edit',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        if (!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
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
        if (!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})

server.get('/api/prize/list',function(req,res){
    request({
        url: config.remote_server + '/pk-web/prize/list',
        json: true,
    },function(err,httpResponse,body) {
        if (!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})


server.get('/api/coupon/list',function(req,res){
    request({
        url: config.remote_server + '/pk-web/prize/coupon/list',
        json: true,
    },function(err,httpResponse,body) {
        if (!!!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})

server.post('/api/prize/delete',function(req,res){
    var bodyText = JSON.stringify(req.body)
    request({
        url: config.remote_server + '/pk-web/prize/delete',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        if (!!!err) {
            console.log(body)
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})