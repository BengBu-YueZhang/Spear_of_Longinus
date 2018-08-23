const app = require('koa')()
const logger = require('koa-logger')
const json = require('koa-json')
const onerror = require('koa-onerror')

const user = require('./routes/user')
const index = require('./routes/index')

onerror(app)

app.use(require('koa-bodyparser')())
app.use(json())
app.use(logger())

app.use(index.routes(), index.allowedMethods())
app.use(user.routes(), user.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
