const Router = require('koa-router')
const router = new Router({ prefix: '/post' })
const PostController = require('../controller/post.controller')

/**
 * 帖子列表
 * @api /post/list
 * @method GET
 */
router.get('/list', async (ctx, next) => {
  const { pagestart, pagesize } = ctx.request.query
  const result = await PostController.getPosts(ctx, pagestart, pagesize)
  ctx.result = {
    code: 200,
    data: {
      list: result,
      msg: 'success'
    }
  }
  await next()
})

/**
 * 帖子详情
 * @api /post
 * @method GET
 */
router.get('/', async (ctx, next) => {
  const { postId, pagestart, pagesize } = ctx.request.query
  const result = await PostController.getPostDetail(ctx, postId, pagestart, pagesize)
  ctx.result = {
    code: 200,
    data: {
      data: result,
      msg: 'success'
    }
  }
  await next()
})

/**
 * 添加一条帖子
 * @api /post
 * @method POST
 */
router.post('/', async (ctx, next) => {
  const { title, detail } = ctx.request.body
  await PostController.addPost(ctx, title, detail)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 删除一条帖子
 * @api /post
 * @method DELETE
 */
router.delete('/', async (ctx, next) => {
  const { postId, createdBy } = ctx.request.body
  await PostController.deletePost(ctx, postId, createdBy)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 增加一条浏览量
 * @api /post/views
 * @method POST
 */
router.post('/views', async (ctx, next) => {
  const { postId } = ctx.request.body
  await PostController.addPageviews(ctx, postId)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 设置置顶
 * @api /post/topping
 * @method POST
 */
router.post('/topping', async (ctx, next) => {
  const { postId, topping } = ctx.request.body
  await PostController.setTopping(ctx, postId, topping)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 设置为精华
 * @api /post/essence
 * @method POST
 */
router.post('/essence', async (ctx, next) => {
  const { postId, essence } = ctx.request.body
  await PostController.setEssence(ctx, postId, essence)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})