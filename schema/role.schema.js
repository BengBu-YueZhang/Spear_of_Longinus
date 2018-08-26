const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 加载角色，因为需要加载到redis中，需要注意在redis链接成功的回调中
// 每一次修改用户信息都需要同步到redis中
// 判断用户的权限，从redis中读取权限
const RoleSchema = new Schema()

module.exports = RoleSchema
