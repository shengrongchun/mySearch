const mongoose = require("mongoose")
//mongoose.Promise = require("bluebird")
mongoose.connect('mongodb://localhost:27017/shChat')
// 得到数据库连接句柄
var db = mongoose.connection
//通过 数据库连接句柄，监听mongoose数据库成功的事件
db.on('open', function(err){
    if(err){
        console.log('数据库连接失败');
        throw err;
    }
    console.log('数据库连接成功')
})

module.exports = {
    User: require("./table/user"),
    // Group: require("./group"),
    Message: require("./table/message")
}