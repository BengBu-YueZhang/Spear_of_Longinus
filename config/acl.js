

const Acl = require('acl')
const R = require('ramda')
const redisClient = require('./redis')
const Role = require('../model/role.model')
const acl = new Acl(new Acl.redisBackend(redisClient))

module.exports = {
  /**
   * 初始化角色权限系统
   * acl.allow([
   *    {
   *      roles: ['角色1'],
   *      allows: [
   *        {
   *           resources: '模块1(权限组)',
   *           permissions：['权限1', '权限2', '权限3'...]
   *        },
   *        {
   *           resources: '模块2(权限组)',
   *           permissions：['权限1', '权限2', '权限3'...]
   *        }
   *      ]
   *    }
   * ])
   */
  acl,

  /**
   * 判断是否有权限
   */
  async isAuth (role, model, auth) {
    return acl.areAnyRolesAllowed(role, model, auth, function (err, result) {
      if (result) {
        return true
      } else {
        return false
      }
    })
  },

  /**
   * 初始化权限
   */
  async initRole () {
    try {
      let pagestart = 1
      let pagesize = 1000000
      // mongo中读取权限数据
      let roles = await Role.find().populate({
        path: 'auths'
      })
      // 格式化权限数据
      let aclRoles = R.map((r) => {
        let allows = {}
        R.forEach(a => { allows[a.group] ? allows[a.group].push(a.code) : allows[a.group] = [a.code] }, r.auths)
        let keys = R.keys(allows)
        return {
          roles: [r.code],
          allows: R.map(k => {
            return {
              resources: k,
              permissions: allows[k]
            }
          }, keys)
        }
      }, roles)
      acl.allow(aclRoles)
      console.log('权限模块加载完成')
    } catch (error) {
    }
  }
}
