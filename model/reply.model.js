const mongoose = require('mongoose')
const ReplySchema = require('../schema/reply.scheam')
const Reply = mongoose.model('Reply', ReplySchema)

module.exports = Reply
