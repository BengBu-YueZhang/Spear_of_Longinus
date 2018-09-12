const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ReplySchema = new Schema({
  // 主题帖的id
  postId: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  // 回复的详情
  detail: {
    type: String,
    required: true
  },
  // 创建的时间
  createdAt: {
    type: Date,
    required: true,
    default: new Date()
  },
  // 创建人
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
})

ReplySchema.options.toObject = {
  transform (doc, ret) {
    ret.id = doc._id
    delete ret._id
    return ret
  }
}

module.exports = ReplySchema
