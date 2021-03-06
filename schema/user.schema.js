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
  // 角色集合
  roles: {
    type: [{
      type: Schema.Types.ObjectId,
      ref: 'Role'
    }],
    default: []
  },
  // 创建时间
  createDate: {
    type: Date,
    default: new Date()
  }
})

UserSchema.options.toObject = {
  transform (doc, ret) {
    ret.id = doc._id
    delete ret._id
    return ret
  }
}

module.exports = UserSchema
