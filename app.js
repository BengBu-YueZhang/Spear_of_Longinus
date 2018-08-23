const Koa = require('koa')
const logger = require('koa-logger')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const error = require('./middleware/error')
const mongo = require('./config/mongo')
const redis = require('./config/redis')

const app = new Koa()
const user = require('./routes/user')

mongo.connect()

onerror(app)
app.use(bodyParser())
app.use(json())
app.use(logger())
app.use(error())

app.use(user.routes(), user.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
