const Koa = require('koa')
const logger = require('koa-logger')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyParser = require('koa-bodyparser')
const error = require('./middleware/error')
const cors = require('cors')
const mongo = require('./config/mongo')
const redis = require('./config/redis')

const app = new Koa()
const user = require('./routes/user')

mongo.connect()

onerror(app)
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
app.use(error())

app.use(user.routes(), user.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
