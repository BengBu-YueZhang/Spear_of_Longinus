const Relpy = require('../model/reply.model')
const PostController = require('../controller/post.controller')
const mongoose = require('mongoose')
const isAuth = require('../config/acl').isAuth
const Validation = require('../util/Validation')

module.exports = {
  /**
   * 添加一条回复
   */
  addReply (ctx, postId, detail) {
    const validation = new Validation()
    validation.add(postId, [{ strategy: 'isNotHave', errMsg: '缺少postId参数' }])
    validation.add(detail, [{ strategy: 'isNotHave', errMsg: '缺少detail参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const session = await mongoose.startSession()
        session.startTransaction()
        const { id } = ctx.decoded
        let relpy = new Relpy({
          postId,
          detail,
          createdBy: id
        })
        relpy = await relpy.save()
        console.log(relpy)
        await PostController.addReply(ctx, relpy._id, postId)
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
  deleteReply (ctx, id, createdBy) {
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        if (!isAuth(roles, 'post', 'delete_other')) {
          if (createdBy !== id) {
            throw new Error('只能删除自己发布的帖子')
          }
        }
        await Relpy.deleteOne({
          $eq: {
            _id: id
          }
        })
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  }
}
