const Router = require('koa-router')
const UserController = require('../controller/user.controller')
const router = new Router({
  prefix: '/user'
})

/**
 * 全部的路由使用中间件:
 * router.use(session()).use(authorize())
 * 单个的路由使用中间件:
 * router.use('/users', userAuth())
 */

/**
 * 添加用户
 * @api /user
 * @method POST
 */
router.post('/', async (ctx) => {
  console.log(ctx.request)
})

/**
 * 更新用户
 * @api /user
 * @method PUT
 */
router.put('/', async (ctx) => {
})

/**
 * 删除用户
 * @api /user
 * @method DELETE
 */
router.delete('/', async (ctx) => {
})

/**
 * 用户列表
 * @api /user/list
 * @method GET
 */
router.get('/list', async (ctx, next) => {
  let { pagestart, pagesize } = ctx.request.query
  pagestart = parseInt(pagestart, 10)
  pagesize = parseInt(pagesize, 10)
  const result = await UserController.users(pagestart, pagesize)
  ctx.result = {
    code: 200,
    data: {
      list: result
    }
  }
  await next()
})

/**
 * 获取用户信息
 * @api /user/personal/:id
 * @method GET
 */
router.get('/personal/:id', async (ctx) => {
  ctx.body = 'Hello World'
})

/**
 * 用户登录
 * @api /user/login
 * @method GET
 */
router.get('/login', async (ctx) => {
})

/**
 * 用户登出
 * @api /user/logout
 * @method GET
 */
router.get('/logout', async (ctx) => {
})

module.exports = router
