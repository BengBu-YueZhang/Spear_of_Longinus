const Router = require('koa-router')
const UploadController = require('../controller/upload.controller')
const router = new Router({ prefix: '/upload' })
const isAuth = require('../middleware/isAuth')
const multer  = require('koa-multer')
const path = require('path')
const fs = require('fs')
const { promisify } = require("util")
const readdir = promisify(fs.readdir)

const storage = multer.diskStorage({
  async destination (req, file, cb) {
    let { params } = req.headers
    params ? params = 'default' : params
    let dirPath = path.resolve(__dirname, `../static/image/${params}`)
    console.log(dirPath)
    try {
      await readdir(dirPath)
      cb(null, dirPath)
    } catch (error) {
      return cb(new Error('上传文件路径出错'))
    }    
  },
  filename (req, file, cb) {
    cb(null, `${Date.now()}.${file.originalname}`)
  }
})

const upload = multer({
  storage,
  limits: 1024 * 1024
})

router.post('/file', isAuth(), upload.single('file'), UploadController.upload)

module.exports = router