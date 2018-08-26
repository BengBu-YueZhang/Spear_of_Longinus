const Validation = require('../util/Validation')
const Role = require('../model/role.model')
const User = require('../model/user.model')
const redisClient = require('../config/redis')
const { promisify } = require('util')
const Acl = require('acl')
const ACL_DB_INDEX = 2
const selectAsync = promisify(redisClient.select).bind(redisClient)
const R = require('ramda')

module.exports = {
  /**
   * 初始化角色权限系统
   */
  init () {
  },

  /**
   * 获取角色列表
   * @param {Number} pagestart
   * @param {Number} pagesize 
   */
  async getRoles (ctx, pagestart = 1, pagesize = 10) {
    const validation = new Validation()
    validation.add(pagestart, [{
      strategy: 'isNumber',
      errMsg: '参数类型不正确'
    }])
    validation.add(pagesize, [{
      strategy: 'isNumber',
      errMsg: '参数类型不正确'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await Role.find(null, '_id name code', {
        skip: pagestart,
        limit: pagesize
      }).catch(() => {
        throw new Error('查询失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 获取单个角色的详情信息
   * @param {String} id 角色的ObjectId
   */
  async getRole (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少用户id信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少用户id信息'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await Role.findById({
        _id: id
      }, 'code name auths _id').populate({
        path: 'auths'
      }).catch(() => {
        throw new Error('查询失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 添加角色
   */
  addRole () {
  },

  /**
   * 更新角色信息
   */
  updateRole () {
  },

  /**
   * 删除角色信息
   */
  deleteRole () {
  }
}
