var db = require('./libs/connect')
db.insert('users',{email: 'qinpei@legendpoker.cn',pwd: 'aabbccdd',name: '秦沛',mobile: '18691077763',createTime: new Date(Date.now() + (8 * 60 * 60 * 1000))})