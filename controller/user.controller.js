const User = require('../model/user.model')
const secret = require('../config/jwt').secret
const timeout = require('../config/jwt').timeout
const bcrypt = require('../config/bcrypt')
const redisClient = require('../config/redis')
const { promisify } = require('util')
const setAsync = promisify(redisClient.set).bind(redisClient)
const delAsync = promisify(redisClient.del).bind(redisClient)
const Validation = require('../util/Validation')
const jwt = require('jsonwebtoken')

/**
 * 获取用户的信息
 * @param {String} id 用户的_id
 */
async function getUser (ctx, id) {
  const validation = new Validation()
  validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
  const errMsg = validation.start()
  if (!errMsg) {
    try {
      return await User.findById(
        {
          _id: id
        },
        'name id roles'
      ).populate({
        path: 'roles',
        populate: {
          path: 'auths'
        }
      })
    } catch (error) {
      throw error
    }
  } else {
    ctx.throw(400, errMsg)
  }
}

module.exports = {
  /**
   * 用户列表
   * @param {Number} pagestart 开始
   * @param {pagesize} pagesize 大小
   */
  async getUsers (ctx, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
    skips = pagesize * (pagestart - 1)
    const validation = new Validation()
    validation.add(pagestart, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    validation.add(pagesize, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const list = await User.find(null, '_id name createDate roles', {
          skip: skips,
          limit: pagesize
        }).populate({
          path: 'roles',
          select: 'name'
        })
        const total = await User.find(null).count()
        return {
          list,
          total
        }
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  getUser,

  /**
   * 添加用户(用户注册)
   * @param {String} name 用户名
   * @param {String} password 密码
   * @param {Array} roles 角色集
   */
  async addUser (ctx, name, password, roles = []) {
    const validation = new Validation()
    validation.add(name, [{ strategy: 'isNotHave', errMsg: '缺少name参数' }])
    validation.add(password, [{ strategy: 'isNotHave', errMsg: '缺少password参数' }])
    validation.add(roles, [{ strategy: 'isArray', errMsg: '参数类型不正确, roles必须为数组类型' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        let user = await User.findOne({ name })
        if (user) throw new Error('用户名已被注册')
        password = bcrypt.encrypt(password)
        user = new User({name, password, roles})
        await user.save()
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 更新用户
   * 角色用专门的接口，进行修改。密码进过了加盐只能重置，不能修改
   * @param {String} id 用户的objectid
   * @param {String} name 更新的用户名
   * @param {Array} roles 角色集合
   */
  async updateUser (ctx, id, name, roles) {
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    validation.add(name, [{ strategy: 'isNotHave', errMsg: '缺少name参数' }])
    validation.add(roles, [{ strategy: 'isArray', errMsg: 'roles参数类型不正确' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await User.findByIdAndUpdate({
          _id: id
        }, {
          $set: {
            name: name,
            roles: roles
          }
        })
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 删除用户
   * @param {String} id 用户的objectid
   */
  async deleteUser (ctx, id) {
    // 使用findOneAndRemove会有问题
    // 参考: https://stackoverflow.com/questions/30417389/the-findoneandremove-and-findoneandupdate-dont-work-as-intended
    // 使用findByIdAndRemove
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await User.findByIdAndRemove({
          _id: id
        })
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 用户登录, 使用动态jwt的密钥
   * @param {String} name 用户名
   * @param {String} password 用户密码
   */
  async login (ctx, name, password) {
    const validation = new Validation()
    validation.add(name, [{ strategy: 'isNotHave', errMsg: '缺少name参数' }])
    validation.add(password, [{ strategy: 'isNotHave', errMsg: '缺少password信息' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const user = await User.findOne({ name }).populate({
          path: 'roles',
          select: 'code'
        })
        if (!user) throw new Error('用户不存在')
        const equal = await bcrypt.compare(user.password, password)
        if (!equal) throw new Error('用户或密码错误')
        
        const token = jwt.sign({ id: user._id, roles: user.roles.map(r => r.code) }, secret, { expiresIn: timeout })
        const redisKey = user._id.toString()
        await setAsync(redisKey, token, 'EX', timeout)
        return token
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 获取当前登录用户的详情信息（使用token中信息）
   */
  async getCurrentUser (ctx, next) {
    const { id } = ctx.decoded
    const result = await getUser(ctx, id)
    ctx.result = {
      code: 200,
      data: result,
      msg: 'success'
    }
    await next()
  },

  /**
   * 用户登出
   */
  async logout (ctx) {
    const { id } = ctx.decoded
    await delAsync(id)
  }
}
