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
 * TODO: 测试完成
 */
router.get('/', async (ctx, next) => {
  let { id } = ctx.request.query
  const result = await UserController.getUser(ctx, id)
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
 * 添加用户
 * @api /user
 * @method POST
 * TODO: 测试完成
 */
router.post('/', async (ctx, next) => {
  let { name, password, roles } = ctx.request.body
  await UserController.addUser(ctx, name, password, roles)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 更新用户
 * @api /user
 * @method PUT
 * TODO: 调试完成
 */
router.put('/', async (ctx, next) => {
  let { id, name } = ctx.request.body
  await UserController.updateUser(ctx, id, name)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 删除用户
 * @api /user
 * @method DELETE
 * TODO: 调试完成
 */
router.delete('/', async (ctx, next) => {
  let { id } = ctx.request.query
  await UserController.deleteUser(ctx, id)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 用户列表
 * @api /user/list
 * @method GET
 * TODO: 测试完成
 */
router.get('/list', async (ctx, next) => {
  let { pagestart, pagesize } = ctx.request.query
  const result = await UserController.getUsers(ctx, pagestart, pagesize)
  ctx.result = {
    code: 200,
    data: { data: result, msg: 'success' }
  }
  await next()
})

/**
 * 用户登录
 * @api /user/login
 * @method POST
 * TODO: 测试完成
 * token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViODEzODAyZTgwNDhkMGRkNmE1MjE3MiIsInJvbGVzIjpbXSwiaWF0IjoxNTM1NTM0NDg0LCJleHAiOjE1MzU2MjA4ODR9.oUZcIGPJqsl0u5l23Q7O_jtGT81UucAxyuC2ct92f78
 */
router.post('/login', async (ctx, next) => {
  let { name, password } = ctx.request.body
  const result = await UserController.login(ctx, name, password)
  ctx.result = {
    code: 200,
    data: {
      token: result,
      msg: 'success'
    }
  }
  await next()
})

/**
 * 用户登出
 * @api /user/logout
 * @method GET
 * TODO: 测试完成
 */
router.post('/logout', async (ctx, next) => {
  let { id } = ctx.request.body
  await UserController.logout(ctx, id)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

module.exports = router
