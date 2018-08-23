const Router = require('koa-router')
const router = new Router()

router.get('/', async (ctx) => {
  ctx.throw(400,'Error Message')
})

module.exports = router
