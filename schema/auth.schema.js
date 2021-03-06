const mongoose = require('mongoose')
const Schema = mongoose.Schema

const AuthSchema = new Schema({
  // 权限的代码
  code: {
    type: String,
    unique: true,
    required: true
  },
  // 权限的名称
  name: {
    type: String,
    required: true
  },
  // 权限的分组
  group: {
    type: String,
    required: true
  }
})

AuthSchema.options.toObject = {
  transform (doc, ret) {
    ret.id = doc._id
    delete ret._id
    return ret
  }
}

module.exports = AuthSchema
