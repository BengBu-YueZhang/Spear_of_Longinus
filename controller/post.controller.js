const Validation = require('../util/Validation')
const pagination = require('../util/pagination')
const Post = require('../model/post.model')
const Reply = require('../model/reply.model')
const mongoose = require('mongoose')
const isAuth = require('../config/acl').isAuth

module.exports = {
  /**
   * 获取帖子列表
   */
  async getPosts (ctx, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
    const { start, end } = pagination(pagestart, pagesize)
    validation.add(pagestart, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    validation.add(pagesize, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        return await Post.find(
          null,
          null,
          {
            skip: start,
            limit: end
          }
        ).populate({
          path: 'users'
        }).populate({
          path: 'replys'
        })
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 获取帖子详情, 包括回复
   */
  async getPostDetail (ctx, postId, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
    const { start, end } = pagination(pagestart, pagesize)
    const validation = new Validation()
    validation.add(postId, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    validation.add(pagestart, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    validation.add(pagesize, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const post = await Post.findById({
          _id: postId
        }).populate({
          path: 'users'
        }).populate({
          path: 'replys'
        })
        const replys = await Reply.find({
          _id: postId          
        }, 'detail createdAt createdBy', {
          skip: start,
          limit: end
        }).populate({
          path: 'users'
        })
        return Promise.resolve({ ...post, replys })
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 添加一条主题帖子
   */
  async addPost (ctx, id, title, detail) {
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    validation.add(title, [{ strategy: 'isNotHave', errMsg: '缺失title参数' }])
    validation.add(detail, [{ strategy: 'isNotHave', errMsg: '缺少detail信息' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const post = new Post({
          createdBy: id,
          title,
          detail
        })
        await post.save()
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 删除主题贴
   * @param {String} postId 帖子的id
   * 1. 普通权限, 只能删除自己发出的帖子(如果是主题贴其他人回复的帖子也会被删除)
   * c. 管理员可以删除任意人的帖子
   */
  async deletePost (ctx, postId) {
    const validation = new Validation()
    validation.add(postId, [{ strategy: 'isNotHave', errMsg: '缺失postId参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const { roles, id } = ctx.decoded
        if (!isAuth(roles, 'post', 'delete_other')) {
          const post = await Post.findById({ _id: postId })
          if (post.createdBy !== id) {
            throw new Error('只能删除自己发布的帖子')
          }
        }
        const session = await mongoose.startSession()
        session.startTransaction()
        await Post.findByIdAndRemove({
          _id: postId
        })
        await Reply.deleteMany({
          postId: {
            $eq: postId
          }
        })
        await session.commitTransaction()
        session.endSession()
      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * post增加一条回复
   * 需要更新回复的总数，最后的回复帖子的字段
   */
  async addReply (ctx, replyId, postId) {
    const validation = new Validation()
    validation.add(replyId, [{ strategy: 'isNotHave', errMsg: '缺少replyId参数' }])
    validation.add(postId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await Post.updateMany(
          {
            $eq: {
              _id: postId
            }
          },
          {
            $inc: {
              replyLength: 1
            },
            $set: {
              lastReply: replyId
            }
          }
        )
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * post删除一条回复
   * 需要更新回复的总数，最后的回复帖子的字段
   */
  async deleteReply (ctx, postId) {
    const validation = new Validation()
    validation.add(postId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const result = await Reply.findOne(
          {
            $eq: {
              postId: postId
            }
          },
          '_id'
        ).sort({
          createdAt: -1
        })
        console.log(result)
        await Post.updateOne(
          {
            $eq: {
              _id: postId
            }
          },
          {
            $inc: {
              replyLength: -1
            }
          }
        )
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 增加一条浏览量
   */
  async addPageviews (postId) {
    const validation = new Validation()
    validation.add(replyId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await Post.findByIdAndUpdate(
          postId,
          {
            $inc: {
              pageviews: 1
            }
          }
        )
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 设置帖子是否置顶
   */
  async setTopping (postId, topping) {
    const validation = new Validation()
    validation.add(replyId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    validation.add(topping, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await Post.findByIdAndUpdate(
          postId,
          {
            $set: {
              topping: topping
            }
          }
        )
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 设置帖子是否加精
   */
  async setEssence (postId, essence) {
    const validation = new Validation()
    validation.add(replyId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    validation.add(essence, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await Post.updateOne(
          {
            $eq: {
              _id: postId
            }
          },
          {
            $set: {
              essence: essence
            }
          }
        )
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  }
}
