var server = require('../../index');
var jsonres = require('../../../libs/jsonres');
var config = require('../../../config');
var db = require('../../../libs/connect');
server.post('/api/user/login',function(req,res){
    var email = req.body.userName;
    var pwd = req.body.password;
    db.count('users',{email:email,pwd: pwd},function(err,count){
        if (!err && count > 0) {
            req.session.email = email;
            req.session.pwd = pwd;
            return res.send(jsonres(200,'登录成功',{email: email}))
        }
        res.send(jsonres(-3,'登录失败',{email: email}))
    })
})

server.get('/api/user/logout',function(req,res){
    req.session.email = '';
    req.session.pwd = '';
    res.send(jsonres(200,'退出成功',[]))
})
