const mongoose = require('mongoose')
const db = mongoose.connection

module.exports = {
  connect () {
    mongoose.connect('mongodb://localhost/test2', {
      useNewUrlParser: true
    })
    db.on('error', console.error.bind(console, 'connection error:'))
    db.once('open', () => {
      console.log('mongo已链接')
    })
  }
}
