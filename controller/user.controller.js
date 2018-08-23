const User = require('../model/user.model')
const secret = require('../config/jwt').secret
const bcrypt = require('../config/bcrypt')

module.exports = {
  /**
   * 添加用户(用户注册)
   * @param {Object} info 用户信息
   */
  async addUser (info) {
    let { username, password } = info
    password = bcrypt.encrypt(password)
    let user = new User({username, password})
    return await user.save()
  },

  /**
   * 用户登录, 使用动态jwt的密钥
   * @param {Object} info 用户信息
   */
  async login (info) {
    // 动态jwt密钥, 使用secret和password的组合, 可以避免在用户更改密码后, token仍然有效
    let dynamicSecret = `${secret}`
  }
}
