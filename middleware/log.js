/**
 * 日志中间件
 */

const fs = require('fs')
const path = require('path')
const { promisify } = require('util')
const get_ip = require('ipware')().get_ip

/**
 * 生成日志文件
 * @param {String} msg 日志信息
 * @param {ENUM} type 日志的类型 ['request', 'responce', 'error']
 */
const log = async (msg, type) => {
  const logTime = new Date().getTime()
  const filename = `log-${type}-${logTime}`
  const path = path.resolve(`../logs/${filename}`)
  msg = `${logTime}-${msg}`
  // 创建写入流
  let writeStream = fs.createWriteStream(path)
  const asyncWrite = promisify(writeStream.write)
  const asyncWriteEnd = promisify(writeStream.end)
  await asyncWrite(msg)
  // 关闭写入流
  await asyncWriteEnd()
}

/**
 * 获取用户的真实ip: https://stackoverflow.com/questions/8107856/how-to-determine-a-users-ip-address-in-node
 * 
 */
const logs = async (ctx, next) => {
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
    await log(
      `${method}-${originalUrl}-${ip}-${params}-${error.message}`,
      'error'
    )
    await next()
  }
}