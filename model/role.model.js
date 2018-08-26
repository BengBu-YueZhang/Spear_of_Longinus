const mongoose = require('mongoose')
const RoleSchema = require('../schema/role.schema')
const Role = mongoose.model('Role', RoleSchema)

module.exports = Role
