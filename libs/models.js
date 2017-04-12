var mongoose = require('mongoose'),
    Schema   = mongoose.Schema,
    ObjectId = Schema.ObjectId;

const users = new Schema({
    email: String,
    pwd: String,
    name: String,
    mobile: String,
    createTime: Date,
    level: String,
    lastLoginTime: Date,
});

const logs = new Schema({
    email: String, // 账号
    date: String, // 操作时间
    des: String,  // 操作地点
    ip: String, // 操作IP
    ua: String, // 操作UA
});

module.exports = {
    users: users,
    logs: logs
}
