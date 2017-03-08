var config = require('../config')
var bodyParser = require('body-parser')
var session = require('express-session')
var cookieParser = require('cookie-parser');
var RedisStrore = require('connect-redis')(session);

var express = require('express')
var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
     secret: 'kamisama',
     name: 'gameManager',
     cookie: {maxAge: Number.MAX_VALUE },
     resave: true,
     saveUninitialized: true,
    //  redis存储session
     store : new RedisStrore(config.redis_host)
}));


app.get('/index.js', function(req,res,next){
    res.sendFile(process.cwd() + '/dist/index.js')
})

app.get('/', function(req,res){
    res.sendFile(process.cwd() + '/dist/index.html')
})

module.exports = app
