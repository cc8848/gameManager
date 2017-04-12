var server = require('../../index');
var jsonres = require('../../../libs/jsonres');
var db = require('../../../libs/connect');

server.get('/api/user/state',function(req,res){
    var email = req.session.email;
    var pwd = req.session.pwd;
    db.count('users',{email:email,pwd: pwd},function(err,count){
        if (!err && count > 0) {
            req.session.email = email;
            req.session.pwd = pwd;
            return res.send(jsonres(200,'已登录',{email: email}))
        }
        res.send(jsonres(-3,'未登录',{email: email}))
    })
})
