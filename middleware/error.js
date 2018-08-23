/**
 * 错误处理中间件
 */
module.exports = function () {
  return async (ctx, next) => {
    try {
      await next()
    } catch (error) {
      ctx.status = error.status || 500
      ctx.body = error.message
    }
  }
}