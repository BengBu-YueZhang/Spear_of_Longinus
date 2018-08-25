
const R = require('ramda')

const strategys = {
  /**
   * 判断val为null或者undefindn的测试
   */
  isNotEmpty (val, errMsg) {
    if (!R.complement(R.isNil)(val)) {
      return errMsg
    }
  }
}

module.exports = strategys
