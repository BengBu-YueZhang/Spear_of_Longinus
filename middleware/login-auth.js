const jwt = require('jsonwebtoken')
const secret = require('../config/jwt').secret
const redisClient = require('../config/redis')
const { promisify } = require('util')
const getAsync = promisify(redisClient.get).bind(redisClient)

/**
 * 登录权限控制
 */
module.exports = function (ctx, next) {
  const token = ctx.headers['x-access-token']
  if (token) {
    jwt.verify(token, secret, function (err, decoded) {
      if (err) {
        ctx.throw(403, 'token已过期')
      } else {
        // 使用redis进行登录的验证, 避免没有登录的时候, 使用之前的token进行访问
        // 从token中获取id信息以及角色信息
        const { id, role } = decoded
        getAsync(id).then(res => {
          if (!res) return ctx.throw(403, 'token失效')
          ctx.decoded = decoded
          // 传递给接口权限进行控制
          next(role)
        }).catch(err => {
          return ctx.throw(403, 'token失效')
        })
      }
    })
  } else {
    ctx.throw(403, '缺少token信息')
  }
}
