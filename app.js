const Koa = require('koa')
const logger = require('koa-logger')
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const result = require('./middleware/result')
const cors = require('@koa/cors');
const mongo = require('./config/mongo')
const redis = require('./config/redis')

const app = new Koa()
const user = require('./routes/user')

mongo.connect()
app.use(cors({
  origin: 'http://127.0.0.1:8080',
  credentials: true,
  methods: ['PUT', 'POST', 'GET', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Content-Length',
    'Authorization',
    'Accept',
    'X-Requested-With',
    'x-access-token'
  ]
}))
app.use(bodyParser())
app.use(json())
app.use(logger())
app.use(result())

// 路由
app.use(user.routes(), user.allowedMethods())


app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
