const jwt = require('jsonwebtoken')
const secret = require('../config/jwt').secret
const redisClient = require('../config/redis')
const { promisify } = require('util')
const getAsync = promisify(redisClient.get).bind(redisClient)

module.exports = function (ctx, next) {
  const token = ctx.headers['x-access-token']
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        ctx.throw(403, 'token已过期')
      } else {
        // 使用redis进行登录的验证, 避免没有登录的时候, 使用之前的token进行访问
        const { id } = decoded
        getAsync(id).then(res => {
          if (!res) return ctx.throw(403, 'token失效')
          ctx.decoded = decoded
          next()
        }).catch(err => {
          return ctx.throw(403, 'token失效')
        })
      }
    })
  } else {
    ctx.throw(403, '缺少token信息')
  }
}
