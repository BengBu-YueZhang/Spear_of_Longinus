const mongoose = require('mongoose')
const RoleSchema = require('../schema/role.schema')
const Role = mongoose.model('Roles', RoleSchema)

module.exports = Role
