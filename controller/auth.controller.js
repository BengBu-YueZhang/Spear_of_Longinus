const Validation = require('../util/Validation')
const Auth = require('../model/auth.model')
const Role = require('../model/role.model')
const pagination = require('../util/pagination')
const mongoose = require('mongoose')

module.exports = {
  /**
   * 获取权限列表
   */
  async getAuths (ctx, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
    const { start, end } = pagination(pagestart, pagesize)
    const validation = new Validation()
    validation.add(pagestart, [{ strategy: 'isNumber', errMsg: '参数类型不正确, pagestart必须为数字' }])
    validation.add(pagesize, [{ strategy: 'isNumber', errMsg: '参数类型不正确, pagesize必须为数字' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        return await Auth.find(
          null,
          null,
          {
            skip: start,
            limit: end
          }
        )
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 获取权限详情
   */
  async getAuth (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{strategy: 'isNotHave', errMsg: '缺少id参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        return await Auth.findById({
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
   * 添加权限
   */
  async addAuth (ctx, code, name, group) {
    const validation = new Validation()
    validation.add(code, [{ strategy: 'isNotHave', errMsg: '缺少code参数' }])
    validation.add(name, [{ strategy: 'isNotHave', errMsg: '缺少name参数' }])
    validation.add(group, [{ strategy: 'isNotHave', errMsg: '缺少group参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const auth = new Auth({code, name, group})
        await auth.save()
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 更新权限
   */
  async updateAuth (ctx, id, name, group) {
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    validation.add(name, [{ strategy: 'isNotHave', errMsg: '缺少name参数' }])
    validation.add(group, [{ strategy: 'isNotHave', errMsg: '缺少group参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await Auth.findByIdAndUpdate({
          _id: id
        }, {
          $set: {
            name: name,
            group: group
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
   * 删除权限
   */
  async deleteAuth (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{ strategy: 'isNotHave', errMsg: '缺少id参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const session = await mongoose.startSession()
        session.startTransaction()
        await Role.updateMany({
          auths: {
            $all: [id]
          }
        }, {
          $pullAll: {
            auths: [id]
          }
        })
        await Auth.findByIdAndRemove({
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
  },

  /**
   * 获取全部权限组
   * 需要使用mongo的聚合操作 :)
   * 参考：https://docs.mongodb.com/manual/reference/command/distinct/#dbcmd.distinct
   */
  async getAuthGroup () {
    try {
      return await Auth.aggregate([
        {
          $group: {
            _id: '$group'
          }
        }
      ])
    } catch (error) {
      throw error
    }
  },
  
  /**
   * 删除权限组
   * 权限组下的全部的权限
   */
  async deleteAuthGroup (ctx, group) {
    const validation = new Validation()
    validation.add(group, [{ strategy: 'isNotHave', errMsg: '缺少group参数' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await Auth.deleteMany({
          group: {
            $eq: group
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
   * 更新权限组
   * 更新权限组下的全部的权限的group
   */
  async updeateAuthGroup (ctx, group, newGroup) {
    const validation = new Validation()
    validation.add(group, [{ strategy: 'isNotHave', errMsg: '缺少group参数' }])
    validation.add(newGroup, [{ strategy: 'isNotHave', errMsg: '缺少权限的newGroup信息' }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        await Auth.updateMany({
          group: group
        }, {
          $set: {
            group: newGroup
          }
        })
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  }
}
