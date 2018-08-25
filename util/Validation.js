const strategys = require('./strategys')

// 验证类
class Validation {
  constructor () {
    // 验证规则的集合
    this.rule = []
  }

  /**
   * 添加验证规则
   * @param {String} value 验证的内容 
   * @param {Array} rule 验证内容的规则 
   */
  add (value, rule) {
    rule.forEach(ruleItem => {
      this.rule.push(() => {
        let { strategy, errMsg } = ruleItem
        return strategys[strategy](value, errMsg)
      })
    })
  }

  /**
   * 开始验证 
   */
  start () {
    for (let i = 0; i < this.rule.length; i++) {
      let msg = this.rule[i]()
      if (msg) {
        return msg
      }
    }
  }
}

module.exports = Validation