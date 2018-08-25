const User = require('../model/user.model')
const secret = require('../config/jwt').secret
const bcrypt = require('../config/bcrypt')
const redisClient = require('../config/redis')
const { promisify } = require('util')
const setAsync = promisify(redisClient.set).bind(redisClient)
const selectAsync = promisify(redisClient.select).bind(redisClient)
const USER_LOGIN_DB_INDEX = 1
const Validation = require('../util/Validation')

module.exports = {
  /**
   * 用户列表
   * @param {Number} pagestart 开始
   * @param {pagesize} pagesize 大小
   */
  async getUsers (ctx, pagestart = 1, pagesize = 10) {
    const result = await User.find(null, null, {
      skip: pagestart,
      limit: pagesize
    })
    return Promise.resolve(result)
  },

  /**
   * 获取用户的信息
   * @param {String} id 用户的_id
   */
  async getUser (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少用户id信息'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await User.findOne({ _id: id }).catch(() => {
        ctx.throw(400, 'id不存在')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 添加用户(用户注册)
   * @param {String} name 用户名
   * @param {String} password 密码
   * @param {Array} role 角色集
   */
  async addUser (ctx, name, password, role) {
    let user = null
    const validation = new Validation()
    validation.add(name, [{
      strategy: 'isNotEmpty',
      errMsg: '缺失用户名'
    }])
    validation.add(password, [{
      strategy: 'isNotEmpty',
      errMsg: '缺失密码'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      user = await User.findOne({ name })
      if (user) throw new Error('用户名已被注册')
      // 密码加盐
      password = bcrypt.encrypt(password)
      user = new User({name, password, role})
      return await user.save().catch(() => {
        throw new Error('添加失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 更新用户
   * 角色用专门的接口，进行修改
   * @param {String} id 用户的objectid
   * @param {String} name 更新的用户名
   * @param {String} password 密码
   */
  async updateUser (ctx, id, name, password) {
    // if (name && password) {
    //   return await User.findOneAndUpdate()
    // } else {
    //   ctx.throw(400, '缺少参数')
    // }
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
