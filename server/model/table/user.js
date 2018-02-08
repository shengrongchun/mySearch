const mongoose = require("mongoose")
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let User = new Schema({
    name: String,
    email: String,
    password: String,
    friends: [ObjectId],
    groups: [ObjectId],
    createTime: {
        type: Date,
        default: Date.now
    },
},{versionKey: false})//除去v_版本锁

module.exports = mongoose.model('users', User)