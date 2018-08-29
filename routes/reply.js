const Router = require('koa-router')
const router = new Router({
  prefix: '/reply'
})
const ReplyController = require('../controller/reply.controller')

/**
 * 添加一条回复
 */
router.post('/', async (ctx, next) => {
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
 */
router.delete('/', async (ctx, next) => {
  const { id, createdBy } = ctx.request.query
  await ReplyController.deleteReply(ctx, id, createdBy)
  ctx.result = {
    code: 200,
    data: {
      list: result,
      msg: 'success'
    }
  }
  await next()
})
