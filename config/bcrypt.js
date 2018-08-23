const bcrypt = require('bcrypt')

module.exports = {
  /**
   * 加密
   */
  encrypt (str) {
    const salt = bcrypt.genSaltSync(10)
    const hash = bcrypt.hashSync(str, salt)
    return hash
  },
  /**
   * 对比
   */
  compare (old, val) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(val, old, function(err, res) {
        return res ? true : false
      })
    })
  }
}