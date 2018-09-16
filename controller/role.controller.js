const Validation = require('../util/Validation')
const Role = require('../model/role.model')
const User = require('../model/user.model')
const mongoose = require('mongoose')

module.exports = {
  /**
   * 获取角色列表
   * @param {Number} pagestart
   * @param {Number} pagesize 
   */
  async getRoles (ctx, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
    skips = pagesize * (pagestart - 1)
    const validation = new Validation()
    validation.add(pagestart, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    validation.add(pagesize, [{ strategy: 'isNumber', errMsg: '参数类型不正确' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const list = await Role.find(
          null,
          '_id name code',
          {
            skip: skips,
            limit: pagesize
          }
        )
        const total = await Role.find().count()
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

  /**
   * 获取角色的详情信息
   * @param {String} id 角色的ObjectId
   */
  async getRole (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        return await Role.findById(
          {
            _id: id
          },
          'code name auths _id'
        ).populate({
          path: 'auths'
        })
      } catch (error) {
        throw error
      }
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
  async addRole (ctx, code, name, auths = []) {
    const validation = new Validation()
    validation.add(code, [{ strategy: 'isNotHave', errMsg: '缺少code参数' }])
    validation.add(name, [{ strategy: 'isNotHave', errMsg: '缺少name参数' }])
    validation.add(auths, [{ strategy: 'isArray', errMsg: '参数类型不正确, auths必须为数组' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const role = new Role({code, name, auths})
        await role.save()
      } catch (error) {
        throw error
      }
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
  async updateRole (ctx, update) {
    let role = {}
    const validation = new Validation()
    let { id, name, auths } = update
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        role = { id }
        if (name) role = { ...role, name }
        if (auths) auths = { ...role, auths }
        await Role.findByIdAndUpdate({
          _id: id
        }, {
          $set: {
            ...role
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
   * TODO:
   * MongoDB4.0支持事务
   * @param {String} id 角色的ObjectId
   */
  async deleteRole (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await User.updateMany({
          roles: {
            $all: [id]
          }
        }, {
          $pullAll: {
            roles: [id]
          }
        })
        await Role.findByIdAndRemove({
          _id: id
        })
        await session.commitTransaction()
        session.endSession()
      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  }
}
