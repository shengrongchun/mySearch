const mongoose = require("mongoose")
const Schema = mongoose.Schema

let ObjectId = Schema.Types.ObjectId

let Message = new Schema({
    toGroup: ObjectId,
    from: ObjectId,
    toUser: ObjectId,
    content: String,
    createTime: {
        type: Date,
        default: Date.now
    },
},{versionKey: false})

module.exports = mongoose.model('message', Message)