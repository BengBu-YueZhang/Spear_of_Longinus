
module.exports = {
  async upload (ctx, next) {
    console.log(ctx.req.file)
    ctx.result = {
      code: 200,
      data: ctx.req.file.path.split('/static')[1],
      msg: 'success'
    }
  }
}
