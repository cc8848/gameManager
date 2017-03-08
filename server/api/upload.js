var server = require('../index')
var jsonres = require('../../libs/jsonres')
var request = require('request')
var config = require('../../config')
var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();
var fs = require('fs')

server.post('/api/upload',multipartMiddleware,function(req,res){
    var r = request.post(
        {
        url: config.remote_server + '/pk-web/sng/icon/upload', 
        json: true,
        method: 'POST',
    },
    function optionalCallback(err, httpResponse, body) {
        res.send(jsonres(200,'success',config.remote_server + body.data))
    })
    var form = r.form();
    form.append('file', fs.createReadStream(req.files.file.path))
})

server.post('/api/prize/upload',multipartMiddleware,function(req,res){
    var r = request.post(
        {
        url: config.remote_server + '/pk-web/prize/icon/upload', 
        json: true,
        method: 'POST',
    },
    function optionalCallback(err, httpResponse, body) {
        res.send(jsonres(200,'success',config.remote_server + body.data))
    })
    var form = r.form();
    form.append('file', fs.createReadStream(req.files.file.path))
})