const Koa = require('koa')
const logger = require('koa-logger')
const json = require('koa-json')
const bodyParser = require('koa-bodyparser')
const result = require('./middleware/result')
const log = require('./middleware/log')
const cors = require('@koa/cors');
const mongo = require('./config/mongo')
const redis = require('./config/redis')
const acl = require('./config/acl').initRole()

const app = new Koa()
const UserRouter = require('./routes/user')
const RoleRouter = require('./routes/role')
const AuthRouter = require('./routes/auth')
const PostRouter = require('./routes/post')
const ReplyRouter = require('./routes/reply')

mongo.connect()
app.use(cors({
  origin: '*',
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
// app.use(log())

// 路由
app.use(UserRouter.routes(), UserRouter.allowedMethods())
app.use(RoleRouter.routes(), RoleRouter.allowedMethods())
app.use(AuthRouter.routes(), AuthRouter.allowedMethods())
app.use(PostRouter.routes(), PostRouter.allowedMethods())
app.use(ReplyRouter.routes(), ReplyRouter.allowedMethods())

app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
})

module.exports = app
