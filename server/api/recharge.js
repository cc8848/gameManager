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

server.post('/api/charge',function(req,res){
    var bodyText = JSON.stringify({
        userPhone: req.body.mobile,
        sign: true,
        moneyNumber: req.body.number,
        moneyType: 'CHIP',
        reasonType: 'OUTLINE',
        desc: '来自后台手工发放',
    })
    console.log(bodyText)
    request({
        url: config.remote_server + '/pk-web/user/charge',
        method: 'POST',
        json: true,
        form: {
            data: bodyText
        }
    },function(err,httpResponse,body) {
        console.log(body)
        if (!!!err) {
            res.send(jsonres(200,'success',body.data || []))
        } else {
            res.send(jsonres(-1,'faild',[]))
        }
    });
})

server.get('/api/charge/list',function(req,res){
    request({
        url: config.remote_server + '/pk-web/user/charge/list',
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


server.get('/api/pay/list',function(req,res){
    request({
        url: config.remote_server + '/pk-web/pay/log/list',
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
