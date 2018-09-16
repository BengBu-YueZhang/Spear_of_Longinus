const Router = require('koa-router')
const RoleController = require('../controller/role.controller')
const router = new Router({
  prefix: '/role'
})
const isAuth = require('../middleware/isAuth')

/**
 * 获取角色列表
 * @api /role/list
 * @method GET
 * TODO: 测试完成
 */
router.get('/list', isAuth(), async (ctx, next) => {
  let { pagestart, pagesize } = ctx.request.query
  const { list, total } = await RoleController.getRoles(ctx, pagestart, pagesize)
  ctx.result = {
    code: 200,
    data: {
      list,
      total,
      msg: 'success'
    }
  }
  await next()
})

/**
 * 获取单个角色信息
 * @api /role
 * @method GET
 * TODO: 测试完成
 */
router.get('/', isAuth(), async (ctx, next) => {
  const { id } = ctx.request.query
  const result = await RoleController.getRole(ctx, id)
  ctx.result = {
    code: 200,
    data: {
      auths: result.auths,
      code: result.code,
      id: result.id,
      name: result.name,
      msg: 'success'
    }
  }
  await next()
})

/**
 * 添加角色
 * @api /role
 * @method POST
 * TODO: 测试完成
 */
router.post('/', isAuth(), async (ctx, next) => {
  const { code, name, auths } = ctx.request.body
  await RoleController.addRole(ctx, code, name, auths)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 更新角色
 * @api /role
 * @method PUT
 * TODO: 测试完成
 */
router.put('/', isAuth(), async (ctx, next) => {
  const { id, name, auths } = ctx.request.body
  await RoleController.updateRole(ctx, { id, name, auths })
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

/**
 * 删除角色
 * @api /role
 * @method DELETE
 * TODO: 测试完成
 */
router.delete('/', isAuth(), async (ctx, next) => {
  const { id, } = ctx.request.query
  await RoleController.deleteRole(ctx, id)
  ctx.result = {
    code: 200,
    data: {
      msg: 'success'
    }
  }
  await next()
})

module.exports = router
