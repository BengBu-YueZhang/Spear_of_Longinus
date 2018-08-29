const jwt = require('jsonwebtoken')
const secret = require('../config/jwt').secret
const redisClient = require('../config/redis')
const { promisify } = require('util')
const getAsync = promisify(redisClient.get).bind(redisClient)
const acl = require('./../config/acl').acl

/**
 * 登录权限控制
 * @param {String} model 权限的模块
 * @param {String} auth 权限名称
 */
module.exports = function (model, auth) {
  return async function (ctx, next) {
    const token = ctx.headers['x-access-token']
    if (token) {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) {
          ctx.throw(403, 'token已过期')
        } else {
          // 使用redis进行登录的验证, 避免没有登录的时候, 使用之前的token进行访问
          // 从token中获取id信息以及角色信息
          const { id, roles } = decoded
          getAsync(id).then(res => {
            if (!res) return ctx.throw(403, 'token失效')
            ctx.decoded = decoded
            if (!model || !auth) {
              next()
            } else {
              // 接口权限验证
              acl.areAnyRolesAllowed(roles, model, auth, function (err, result) {
                if (result) {
                  next()
                } else {
                  return ctx.throw(403, '没有操作权限')
                }
              })
            }
          }).catch(err => {
            return ctx.throw(403, 'token失效')
          })
        }
      })
    } else {
      ctx.throw(403, '缺少token信息')
    }
  }
}
