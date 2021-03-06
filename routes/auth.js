const Router = require('koa-router')
const AuthController = require('../controller/auth.controller')
const router = new Router({
  prefix: '/auth'
})
const isAuth = require('../middleware/isAuth')

/**
 * 获取权限列表
 * @api /auth/list
 * TODO: 测试完成
 */
router.get('/list', isAuth(), async (ctx, next) => {
  const { pagestart, pagesize, group } = ctx.request.query
  const result = await AuthController.getAuths(ctx, pagestart, pagesize, group)
  ctx.result = {
    code: 200,
    data: {
      ...result,
      msg: 'success'
    }
  }
  await next()
})

/**
 * 获取权限详情
 * @api /auth
 * @method GET
 * TODO: 测试完成
 */
router.get('/', isAuth(), async (ctx, next) => {
  const { id } = ctx.request.query
  const result = await AuthController.getAuth(ctx, id)
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
 * 添加权限
 * @api /auth
 * @method POST
 * TODO: 测试完成
 */
router.post('/', isAuth(), async (ctx, next) => {
  const { code, name, group } = ctx.request.body
  await AuthController.addAuth(ctx, code, name, group)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 更新权限
 * @api /auth
 * @method PUT
 * TODO: 测试完成
 */
router.put('/', isAuth(), async (ctx, next) => {
  const { id, name, group } = ctx.request.body
  await AuthController.updateAuth(ctx, id, name, group)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 删除权限
 * 需要将管理的角色权限一并删除
 * @api /auth
 * @method DELETE
 * TODO: 测试完成
 */
router.delete('/', isAuth(), async (ctx, next) => {
  const { id } = ctx.request.query
  await AuthController.deleteAuth(ctx, id)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 获取全部的权限组
 * @api /auth/group
 * @method GET
 * TODO: 测试完成
 */
router.get('/group', isAuth(), async (ctx, next) => {
  const result = await AuthController.getAuthGroup()
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
 * 删除权限组
 * @api /auth/group
 * @method DELETE
 * TODO: 测试完成
 */
router.delete('/group', isAuth(), async (ctx, next) => {
  const { group } = ctx.request.query
  await AuthController.deleteAuthGroup(ctx, group)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 更新权限组的名称
 * @api /auth/group
 * @method PUT
 * TODO: 测试完成
 */
router.put('/group', isAuth(), async (ctx, next) => {
  const { group, newGroup } = ctx.request.body
  await AuthController.updeateAuthGroup(ctx, group, newGroup)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

module.exports = router