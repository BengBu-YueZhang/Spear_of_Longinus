const User = require('../model/user.model')
const secret = require('../config/jwt').secret
const bcrypt = require('../config/bcrypt')
const redisClient = require('../config/redis')
const { promisify } = require('util')
const setAsync = promisify(redisClient.set).bind(redisClient)
const selectAsync = promisify(redisClient.select).bind(redisClient)
const USER_LOGIN_DB_INDEX = 1

module.exports = {
  /**
   * 
   */
  async users (filter) {
  },

  /**
   * 添加用户(用户注册)
   * @param {Object} info 用户信息
   */
  async addUser (info) {
    let { name, password } = info
    const user = await User.findOne({ name })
    if (user) throw new Error('用户名已被注册')
    password = bcrypt.encrypt(password)
    let user = new User({name, password})
    return await user.save()
  },

  /**
   * 用户登录, 使用动态jwt的密钥
   * @param {Object} info 用户信息
   */
  async login (info) {
    let { name, password } = info
    const user = await User.findOne({ name })
    if (!user) throw new Error('用户不存在')
    const equal = await bcrypt.compare(user.password, password)
    if (!equal) throw new Error('用户或密码错误')
    // 动态jwt密钥, 使用secret和password的组合, 可以避免在用户更改密码后, token仍然有效
    const dynamicSecret = `${secret}${user.password}`
    const token = jwt.sign({ id: user._id }, dynamicSecret, { expiresIn: 60 * 60 * 24 })
    const redisKey = user._id.toString()
    await selectAsync(USER_LOGIN_DB_INDEX)
    await setAsync(redisKey, token, 'EX', 60 * 60 * 24)
    return Promise.resolve({ token })
  }
}
