const mongoose = require('mongoose')
const AuthSchema = require('../schema/auth.schema')
const Auth = mongoose.model('Auth', AuthSchema)

module.exports = Auth
