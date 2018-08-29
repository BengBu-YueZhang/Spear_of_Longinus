
const R = require('ramda')

const strategys = {
  /**
   * 判断val为null或者undefindn的测试
   */
  isNotEmpty (val, errMsg) {
    if (!R.complement(R.isNil)(val)) {
      return errMsg
    }
  },

  /**
   * 是否为空字符串的策略
   */
  isNotNullString (val, errMsg) {
    if (R.trim(val) === '') {
      return errMsg
    }
  },

  /**
   * 判断参数不等于null并且不等于undefindn以及空字符串的策略
   */
  isNotHave (val, errMsg) {
    if (!R.complement(R.isNil)(val) || R.trim(val) === '') {
      return errMsg
    }
  },
  
  /**
   * 判断数字策略
   */
  isNumber (val, errMsg) {
    if (R.identical(NaN, val) || val === Infinity || val === -Infinity || !R.is(Number, val)) {
      return errMsg
    }
  },

  /**
   * 判断数组策略
   */
  isArray (val, errMsg) {
    if (!R.is(Array, val)) {
      return errMsg
    }
  }
}

module.exports = strategys
