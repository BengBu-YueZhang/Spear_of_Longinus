const jwt = require('jsonwebtoken')
const secret = require('../config/jwt').secret
const redisClient = require('../config/redis')
const { promisify } = require('util')
const getAsync = promisify(redisClient.get).bind(redisClient)
const acl = require('./../config/acl').acl
// const jwt = require('koa-jwt')

/**
 * 登录权限控制
 * @param {String} model 权限的模块
 * @param {String} auth 权限名称
 */
module.exports = function (model, auth) {
  return async function (ctx, next) {
    // const token = ctx.headers['x-access-token']
    // TODO: 方便测试展示写死token
    const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViODEzODAyZTgwNDhkMGRkNmE1MjE3MiIsInJvbGVzIjpbXSwiaWF0IjoxNTM1NTQ2Njc2LCJleHAiOjE1MzU2MzMwNzZ9.O-Rb8fdgAEeNWPxMGouMr2cig9kCec4Ftl_DulOKAnk'
    if (token) {
      // token验证
      let decoded = null
      try {
        decoded = await jwt.verify(token, secret)
      } catch (error) {
        ctx.throw(403, 'token失效')
      }
      const { id, roles } = decoded
      // 登录验证
      try {
        await getAsync(id)
      } catch (error) {
        ctx.throw(403, 'token已过期')
      }
      ctx.decoded = decoded
      if (!model || !auth) {
        await next()
      } else {
        try {
          acl.areAnyRolesAllowed(roles, model, auth)
        } catch (error) {
          ctx.throw(403, '接口你没有权限')
        }
        await next()
      }
    } else {
      ctx.throw(403, '缺少token信息')
    }
  }
}
