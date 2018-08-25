const mongoose = require('mongoose')
const Schema = mongoose.Schema

/**
 * 用户模型
 */
const UserSchema = new Schema({
  // 用户名
  name: {
    type: String,
    unique: true,
    min: 3,
    required: true
  },
  // 密码
  password: {
    type: String,
    required: true,
    min: 6
  },
  // 角色集合(默认root用户)
  role: {
    type: [String],
    default: ['root']
  },
  // 创建时间
  createDate: {
    type: Date,
    default: new Date()
  }
})

module.exports = UserSchema
