const Router = require('koa-router')
const router = new Router({ prefix: 'user' })

/**
 * 获取用户信息
 * @api /user
 * @method GET
 */
router.get('/', async (ctx) => {
})

/**
 * 添加用户
 * @api /user
 * @method POST
 */
router.post('/', async (ctx) => {
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
})

module.exports = router
