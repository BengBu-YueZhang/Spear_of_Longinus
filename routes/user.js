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
 * 获取用户信息
 * @api /user/:id
 * @method GET
 */
router.get('/:id', async (ctx) => {
  ctx.body = 'Hello World'
})

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
router.get('/list', async (ctx) => {
  console.log(ctx.params)
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
