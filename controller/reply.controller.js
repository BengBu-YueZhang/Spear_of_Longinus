const Relpy = require('../model/reply.model')
const PostController = require('../controller/post.controller')
const isAuth = require('../config/acl').isAuth
const Validation = require('../util/Validation')
const mongoose = require('mongoose')

module.exports = {
  /**
   * 添加一条回复
   */
  async addReply (ctx, postId, detail) {
    const validation = new Validation()
    validation.add(postId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    validation.add(detail, [{ strategy: 'isNotHave', errMsg: '缺少detail参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        const { id } = ctx.decoded
        let relpy = new Relpy({
          postId,
          detail,
          createdBy: id
        })
        relpy = await relpy.save()
        await PostController.addReply(ctx, relpy._id.toString(), postId)
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
   * 删除一条回复
   */
  async deleteReply (ctx, postId, replyId, createdBy) {
    const validation = new Validation()
    validation.add(postId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    validation.add(replyId, [{ strategy: 'isNotHave', errMsg: '缺少replyId参数' }])
    validation.add(createdBy, [{ strategy: 'isNotHave', errMsg: '缺少createdBy参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        const { roles, id } = ctx.decoded
        if (!isAuth(roles, 'post', 'delete_other')) {
          if (createdBy !== id) {
            throw new Error('只能删除自己发布的帖子')
          }
        }
        await Relpy.findByIdAndRemove(replyId)
        await PostController.deleteReply(ctx, postId)
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
  }
}
