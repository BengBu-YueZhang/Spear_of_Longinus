const Router = require('koa-router')
const router = new Router({
  prefix: '/reply'
})
const ReplyController = require('../controller/reply.controller')
const isAuth = require('../middleware/isAuth')

/**
 * 添加一条回复
 * @api /reply
 * @method POST
 * TODO: 测试完成
 */
router.post('/', isAuth(), async (ctx, next) => {
  const { postId, detail } = ctx.request.body
  await ReplyController.addReply(ctx, postId, detail)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 删除一条回复
 * @api /reply
 * @method DELETE
 */
router.delete('/', isAuth(), async (ctx, next) => {
  const { postId, id, createdBy } = ctx.request.query
  await ReplyController.deleteReply(ctx, postId, id, createdBy)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 最近七天每一天的帖子回复数目
 */
router.get('/statistics', ReplyController.statistics)

module.exports = router
