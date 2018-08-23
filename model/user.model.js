const mongoose = require('mongoose')
const UserSchema = require('../schema/user.schema')
const User = mongoose.model('Users', UserSchema)

module.exports = User
