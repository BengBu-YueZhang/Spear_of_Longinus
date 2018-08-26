const Validation = require('../util/Validation')
const Role = require('../model/role.model')
const redisClient = require('../config/redis')
const { promisify } = require('util')
const User = require('../model/user.model')
const Acl = require('acl')
const ACL_DB_INDEX = 2
const selectAsync = promisify(redisClient.select).bind(redisClient)
const R = require('ramda')

module.exports = {
  /**
   * 初始化角色权限系统
   * 将权限信息加载到redis中
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
   * @param {String} code 角色代号
   * @param {String} name 角色名
   * @param {Array} auths 角色权限集
   */
  addRole (ctx, code, name, auths = []) {
    const validation = new Validation()
    validation.add(code, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少角色code信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'code不能为空字符串'
    }])
    validation.add(name, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少角色name信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'name不能为空字符串'
    }])
    validation.add(auths, [{
      strategy: 'isArray',
      errMsg: 'auths必须为数组'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      const role = new Role({code, name, auths})
      return await role.save().catch(() => {
        throw new Error('保存失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 更新角色信息
   * @param {String} id 角色id
   * @param {String} name 角色名
   * @param {Array} auths 角色权限集
   */
  updateRole (ctx, id, name, auths = []) {
    const validation = new Validation()
    validation.add(id, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少用户id信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少用户id信息'
    }])
    validation.add(name, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少角色name信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'name不能为空字符串'
    }])
    validation.add(auths, [{
      strategy: 'isArray',
      errMsg: 'auths必须为数组'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await Role.findByIdAndUpdate({
        _id: id
      }, {
        $set: {
          name: name,
          auths: auths
        }
      }).catch(() => {
        throw new Error('更新失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 删除角色信息, 因为用户表关联了角色信息，所以需要将用户表中对应的角色id同时删除了
   * @param {String} id 角色的ObjectId
   */
  deleteRole (ctx, id) {
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
      return await User.updateMany({
        roles: {
          $all: [id]
        }
      }, {
        $pullAll: {
          roles: [id]
        }
      }).then(async () => {
        return await Role.findByIdAndUpdate({
          _id: id
        })
      }).catch(() => {
        throw new Error('删除失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  }
}
