const Router = require('koa-router')
const AuthController = require('../controller/auth.controller')
const RoleController = require('../controller/role.controller')
const router = new Router({
  prefix: '/auth'
})

/**
 * TODO:
 * 接口是需要对应的权限才可以访问, 而接口所需要的权限是在代码中写死的。
 * 接口不会对前端开放（cors配置的可以需要做一下修改）
 * 前端可以做的就是配置角色的权限
 * 前端的权限，可以直接通过后端的权限来做
 * 比如有这个权限，显示这个按钮，没有这个权限，不显示这个按钮
 */

/**
 * 获取权限列表
 * @api /auth/list
 */
router.get('/list', async (ctx, next) => {
  const { pagestart, pagesize } = ctx.request.query
  const result = await AuthController.getAuths(ctx, pagestart, pagesize)
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
 * 获取权限
 * @api /auth
 * @method GET
 */
router.get('/', async (ctx, next) => {
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
 */
router.post('/', async (ctx, next) => {
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
 */
router.put('/', async (ctx, next) => {
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
 */
router.delete('/', async (ctx, next) => {
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
 */
router.get('/group', async (ctx, next) => {
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
 */
router.delete('/group', async (ctx, next) => {
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
 */
router.put('/group', async (ctx, next) => {
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