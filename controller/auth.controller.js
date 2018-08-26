const Validation = require('../util/Validation')
const Auth = require('../model/auth.model')
const Role = require('../model/role.model')

module.exports = {
  /**
   * 获取权限列表
   */
  async getAuths (ctx, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
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
      return await Auth.find(null, null, {
        skip: pagestart,
        limit: pagesize
      }).catch(() => {
        throw new Error('获取权限列表失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 获取权限详情
   */
  async getAuth (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限id信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少权限id信息'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await Auth.findById({
        _id: id
      }).catch(() => {
        throw new Error('获取权限详情失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 添加权限
   */
  async addAuth (ctx, code, name, group) {
    const validation = new Validation()
    const errMsg = validation.start()
    validation.add(code, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的code信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'code信息不能为空字符串'
    }])
    validation.add(name, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的name信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'name信息不能为空字符串'
    }])
    validation.add(group, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的group信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'group信息不能为空字符串'
    }])
    if (!errMsg) {
      const auth = new Auth({code, name, group})
      return auth.save().catch(() => {
        throw new Error('保存权限失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 更新权限
   */
  async updateAuth (ctx, id, name, group) {
    const validation = new Validation()
    validation.add(id, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限id信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少权限id信息'
    }])
    validation.add(name, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的name信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'name信息不能为空字符串'
    }])
    validation.add(group, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的group信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'group信息不能为空字符串'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await Auth.findByIdAndUpdate({
        _id: id
      }, {
        $set: {
          name: name,
          group: group
        }
      }).catch(() => {
        throw new Error('更新权限失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 删除权限
   */
  deleteAuth (ctx, id) {
    const validation = new Validation()
    validation.add(id, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限id信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少权限id信息'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      Role.updateMany({
        auths: [id]
      }, {
        $pullAll: {
          auths: [id]
        }
      }).then(async () => {
        return await Auth.findByIdAndRemove({
          _id: id
        })
      }).catch(() => {
        throw new Error('删除权限失败')
      })
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
    return await Auth.aggregate([
      {
        $group: {
          groupName: '$group'
        }
      }
    ]).catch(() => {
      throw new Error('获取权限组列表失败')
    })
  },
  
  /**
   * 删除权限组
   * 权限组下的全部的权限
   */
  async deleteAuthGroup (ctx, group) {
    const validation = new Validation()
    validation.add(group, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的group信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'group信息不能为空字符串'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await Role.deleteMany({
        group: group
      }).catch(() => {
        throw new Error('删除权限组失败')
      })
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
    validation.add(group, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的group信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'group信息不能为空字符串'
    }])
    validation.add(newGroup, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少权限的newGroup信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'newGroup信息不能为空字符串'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return Auth.updateMany({
        group: group
      }, {
        $set: {
          group: newGroup
        }
      }).catch(() => {
        throw new Error('更新权限组失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  }
}
