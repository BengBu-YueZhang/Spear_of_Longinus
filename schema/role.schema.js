const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 加载角色，因为需要加载到redis中，需要注意在redis链接成功的回调中
// 每一次修改用户信息都需要同步到redis中 init Auth
// 判断用户的权限，从redis中读取权限
// 用户的token保存了用户的角色信息, 修改用户的角色需要重新登录, 以重新获取角色
// role和auth需要做关联的操作
const RoleSchema = new Schema({
  code: {
    type: String,
    unique: true,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  auths: {
    // role表与auth表进行关联操作
    // auths为角色的权限集合
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Auth'
    }],
    default: [],
    required: true
  }
})

module.exports = RoleSchema
