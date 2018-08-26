const Router = require('koa-router')
const AuthController = require('../controller/auth.controller')
const RoleController = require('../controller/role.controller')
const router = new Router({
  prefix: '/auth'
})

/**
 * 获取权限列表
 */
router.get('/list', async (ctx, next) => {
})

/**
 * 获取权限
 */
router.get('/', async (ctx, next) => {
})

/**
 * 添加权限
 */
router.post('/', async (ctx, next) => {
})

/**
 * 更新权限
 */
router.put('/', async (ctx, next) => {
})

/**
 * 删除权限
 * 需要将管理的角色权限一并删除
 */
router.delete('/', async (ctx, next) => {
})

module.exports = router