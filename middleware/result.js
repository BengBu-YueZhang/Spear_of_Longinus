/**
 * 错误处理中间件
 */
module.exports = function () {
  return async (ctx, next) => {
    try {
      const { result } = ctx
      if (result) {
        ctx.response.type = 'json'
        ctx.response.status = 200
        ctx.response.body = result
      }
      await next()
    } catch (error) {
      ctx.response.type = 'json'
      ctx.response.status = error.status || 500
      ctx.response.body = error.message
    }
  }
}