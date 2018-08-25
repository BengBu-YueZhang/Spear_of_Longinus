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
 * 获取用户
 * @api /user
 * @method GET
 */
router.get('/', async (ctx, next) => {
  let { id } = ctx.request.query
  const result = await UserController.getUser(ctx, id)
  ctx.result = {
    code: 200,
    data: { data: result, msg: 'success' }
  }
  await next()
})

/**
 * 添加用户
 * @api /user
 * @method POST
 */
router.post('/', async (ctx, next) => {
  let { name, password, role } = ctx.request.body
  await UserController.addUser(ctx, name, password, role)
  ctx.result = {
    code: 200,
    data: { msg: 'success' }
  }
  await next()
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
  const result = await UserController.getUsers(ctx, pagestart, pagesize)
  ctx.result = {
    code: 200,
    data: { list: result, msg: 'success' }
  }
  await next()
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
