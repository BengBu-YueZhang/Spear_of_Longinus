const Validation = require('../util/Validation')
const Role = require('../model/role.model')
const User = require('../model/user.model')
const pagination = require('../util/pagination')

module.exports = {
  /**
   * 获取角色列表
   * @param {Number} pagestart
   * @param {Number} pagesize 
   */
  async getRoles (ctx, pagestart = 1, pagesize = 10) {
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
      const { start, end } = pagination(pagestart, pagesize)
      return await Role.find(null, '_id name code', {
        skip: start,
        limit: end
      }).catch(() => {
        throw new Error('获取角色列表失败')
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
      errMsg: '缺少角色id信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少角色id信息'
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
  async addRole (ctx, code, name, auths = []) {
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
  async updateRole (ctx, id, name, auths = []) {
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
  async deleteRole (ctx, id) {
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
        return await Role.findByIdAndRemove({
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
