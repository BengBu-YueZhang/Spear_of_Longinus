/**
 * 日志中间件
 */

const fs = require('fs')
const { promisify } = require('util')
const get_ip = require('ipware')().get_ip
const path = require('path')

/**
 * 生成日志文件
 * @param {String} msg 日志信息
 * @param {ENUM} type 日志的类型 ['request', 'responce', 'error']
 */
const log = async (msg, type) => {
  const logTime = new Date().getTime()
  const filename = `log-${type}-${logTime}`
  const filePath = path.resolve(__dirname + `/../logs/${filename}`)
  msg = `${logTime}-${msg}`
  const asyncAppendfile = promisify(fs.appendFile)
  await asyncAppendfile(filePath, msg)
}

/**
 * 获取用户的真实ip: https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
 * 
 */
const logs = () => {
  return async (ctx, next) => {
    let query = ctx.request.query ? JSON.stringify(ctx.request.query) : ''
    let body = ctx.request.body ? JSON.stringify(ctx.request.body) : ''
    let params = query ? query : body
    let ip = get_ip(ctx.request)
    let originalUrl = ctx.originalUrl
    let method = ctx.method
    try {
      await log(
        `${method}-${originalUrl}-${ip}-${params}`,
        'request'
      )
      await next()
    } catch (error) {
      console.log(error.message)
      await log(
        `${method}-${originalUrl}-${ip}-${params}-${error.message}`,
        'error'
      )
    }
  }
}

module.exports = logs
