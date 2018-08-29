const mongoose = require('mongoose')
const Schema = mongoose.Schema

const PostSchema = new Schema({
  // 帖子的标题
  title: {
    type: String,
    required: true
  },
  // 帖子的详情
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
  },
  // 最后的回复帖子
  lastReply: {
    type: Schema.Types.ObjectId,
    ref: 'Reply'
  },
  // 回复的总数
  replyLength: {
    type: Number,
    default: 0
  },
  // 浏览量
  pageviews: {
    type: Number,
    default: 0
  },
  // 是否置顶
  topping: {
    type: Number,
    default: 0,
    enum: [0, 1]
  },
  // 是否精华
  essence: {
    type: Number,
    default: 0,
    enum: [0, 1]
  },
  // 帖子的类型
  type: {
    type: String,
    default: 'normal'
  }
})
