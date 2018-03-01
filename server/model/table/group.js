const mongoose = require("mongoose")
const Schema = mongoose.Schema
let ObjectId = Schema.Types.ObjectId

let Group = new Schema({
    name: String,
    avatar: String,
    member: [ObjectId],
    owner: ObjectId,
    createAt: {
        type: Date,
        default: Date.now
    }
},{versionKey: false})

module.exports = mongoose.model('group', Group)