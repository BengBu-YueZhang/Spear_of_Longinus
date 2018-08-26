const Router = require('koa-router')
const RoleController = require('../controller/role.controller')
const router = new Router({
  prefix: '/role'
})

/**
 * 获取角色列表
 */
router.get('/list', async (ctx, next) => {
  const { pagestart, pagesize } = ctx.request.query
  pagestart = parseInt(pagestart, 10)
  pagesize = parseInt(pagesize, 10)
  const result = await RoleController.getRoles(ctx, pagestart, pagesize)
  ctx.result = {
    code: 200,
    data: { list: result, msg: 'success' }
  }
  await next()
})

/**
 * 获取角色
 */
router.get('/', async (ctx, next) => {
})

/**
 * 添加角色
 */
router.post('/', async (ctx, next) => {
})

/**
 * 更新角色
 */
router.put('/', async (ctx, next) => {
})

/**
 * 删除角色
 */
router.delete('/', async (ctx, next) => {
})

module.exports = router
