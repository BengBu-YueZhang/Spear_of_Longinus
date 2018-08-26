

const Acl = require('acl')
const R = require('ramda')
const redisClient = require('./redis')
const Role = require('../model/role.model')

let acl = new Acl(new Acl.redisBackend(redisClient))

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
        let role = {
          roles: [r.code],
          allows: []
        }
        for (let i = 0; i < r.auths.length; i++) {
          if (!allows[r.auths[i].group]) {
            allows[r.auths[i].group] = [r.auths[i].code]
          }
        }
        for (let key in allows) {
          role.allows.push({
            resources: key,
            permissions: allows[key]
          })
        }
        return role
      }, roles)
      acl.allow(aclRoles)
      console.log('权限模块加载完成')
    } catch (error) {
    }
  }
}
