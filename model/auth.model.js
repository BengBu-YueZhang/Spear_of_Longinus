const mongoose = require('mongoose')
const AuthSchema = require('../schema/auth.schema')
const Auth = mongoose.model('Auths', AuthSchema)

module.exports = Auth
