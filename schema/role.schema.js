const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 加载角色，因为需要加载到redis中，需要注意在redis链接成功的回调中
const RoleSchema = new Schema()

module.exports = RoleSchema
