const Relpy = require('../model/reply.model')
const PostController = require('../controller/post.controller')
const isAuth = require('../config/acl').isAuth
const Validation = require('../util/Validation')
const mongoose = require('mongoose')
const moment = require('moment')

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
  },

  /***
   * 统计时间范围内的每一天的回复数量
   */
  async statistics (ctx, next) {
    let start = moment().subtract(7, 'days').hour(0).minute(0).second(0).millisecond(0)
    let end = moment().hour(23).minute(59).second(59).millisecond(999)
    let initData = []
    for (let i = 1; i < 8; i++) {
      initData.push({
        createdAt: moment().subtract(7, 'days').hour(0).minute(0).second(0).millisecond(0).add(i, 'days').format('YYYY-MM-DD'),
        count: 0
      })
    }
    let result = await Relpy.aggregate([
      {
        $match: {
          createdAt: {
            $gt: start.toDate(),
            $lt: end.toDate()
          }
        }
      },
      {
        $project: {
          formatCreatedAt: {
            $dateToString: {
              format: "%Y-%m-%d",
              date: "$createdAt"
            }
          }
        }
      },
      {
        $group: {
          _id : {
            createdAt: "$formatCreatedAt"
          },
          count: { $sum: 1 }
        }
      }
    ])
    result = result.map(r => {
      return {
        createdAt: r._id.createdAt,
        count: r.count
      }
    })
    initData = initData.map(i => {
      let index = result.findIndex(v => v.createdAt === i.createdAt)
      if (index > -1) {
        i.count = result[index].count
      }
      return i
    })
    ctx.result = {
      code: 200,
      data: initData,
      msg: 'success'
    }
    await next()
  }
}
