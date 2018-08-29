const Validation = require('../util/Validation')
const pagination = require('../util/pagination')
const Post = require('../model/post.model')
const Reply = require('../model/reply.model')
const mongoose = require('mongoose')
const isAuth = require('../config/acl').isAuth

module.exports = {
  /**
   * 获取帖子列表
   */
  async getPosts (ctx, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
    const { start, end } = pagination(pagestart, pagesize)
    validation.add(pagestart, [{
      strategy: 'isNumber',
      errMsg: '参数类型不正确'
    }])
    validation.add(pagesize, [{
      strategy: 'isNumber',
      errMsg: '参数类型不正确'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      return await Post.find(null, null, {
        skip: start,
        limit: end
      }).populate({
        path: 'users'
      }).populate({
        path: 'replys'
      }).catch(() => {
        throw new Error('获取帖子列表失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 获取帖子详情, 包括回复
   */
  async getPostDetail (ctx, postId, pagestart = 1, pagesize = 10) {
    pagestart = parseInt(pagestart, 10)
    pagesize = parseInt(pagesize, 10)
    const { start, end } = pagination(pagestart, pagesize)
    const validation = new Validation()
    validation.add(postId, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少帖子id信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少帖子id信息'
    }])
    validation.add(pagestart, [{
      strategy: 'isNumber',
      errMsg: '参数类型不正确'
    }])
    validation.add(pagesize, [{
      strategy: 'isNumber',
      errMsg: '参数类型不正确'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      try {
        const post = await Post.findById({
          _id: postId
        }).populate({
          path: 'users'
        }).populate({
          path: 'replys'
        })
        const replys = await Reply.find({
          _id: postId          
        }, 'detail createdAt createdBy', {
          skip: start,
          limit: end
        }).populate({
          path: 'users'
        })
        return Promise.resolve({ ...post, replys })
      } catch (error) {
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 添加一条主题帖子
   */
  async addPost (ctx, id, title, detail) {
    const validation = new Validation()
    validation.add(id, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少主题帖id'
    }, {
      strategy: 'isNotNullString',
      errMsg: '缺少主题帖id'
    }])
    validation.add(title, [{
      strategy: 'isNotEmpty',
      errMsg: '缺失title信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'title不能为空字符串'
    }])
    validation.add(detail, [{
      strategy: 'isNotEmpty',
      errMsg: '缺少detail信息'
    }, {
      strategy: 'isNotNullString',
      errMsg: 'detail不能为空字符串'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      const post = new Post({
        createdBy: id,
        title,
        detail
      })
      await post.save().catch(() => {
        throw new Error('帖子发布失败')
      })
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * 删除帖子
   * @param {String} postId 帖子的id
   * a. 只能删除自己发出的帖子
   * b. 删除主题帖，回复的帖子也会被删除
   * c. 管理员可以删除任意的帖子
   */
  async deletePost (ctx, postId) {
    const validation = new Validation()
    validation.add(postId, [{
      strategy: 'isNotEmpty',
      errMsg: '参数不全'
    }, {
      strategy: 'isNotNullString',
      errMsg: '参数不全'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
      const { role } = ctx.decoded
      // 判断是否有删除其他的帖子的权限，如果没有则需要判断帖子是否属于自己的, 才能删除
      if (!isAuth(role, 'post', 'delete_other')) {
        const post = await Post.findById({ _id: postId })
        if (post.createdBy !== uid) {
          throw new Error('只能删除自己发布的帖子')
        }
      }
      // 删除帖子
      const session = await mongoose.startSession()
      session.startTransaction()
      try {
        // 删除Post表中对应的帖子
        await Post.findByIdAndRemove({
          _id: postId
        })
        // 删除Reply回复的帖子
        await Reply.deleteMany({
          postId: {
            $eq: postId
          }
        })
        await session.commitTransaction()
        session.endSession()
      } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw error
      }
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * post增加一条回复
   * 需要更新回复的总数，最后的回复帖子的字段
   */
  async addReply (ctx, replyId, postId) {
    const validation = new Validation()
    validation.add(replyId, [{
      strategy: 'isNotEmpty',
      errMsg: '参数不全'
    }, {
      strategy: 'isNotNullString',
      errMsg: '参数不全'
    }])
    const errMsg = validation.start()
    if (!errMsg) {
    } else {
      ctx.throw(400, errMsg)
    }
  },

  /**
   * post删除一条回复
   * 需要更新回复的总数，最后的回复帖子的字段
   */
  async deleteReply (ctx) {
  },

  /**
   * 增加一条浏览量
   */
  async addPageviews () {
  },

  /**
   * 设置帖子是否置顶
   */
  async setTopping () {
  },

  /**
   * 设置帖子是否加精
   */
  async setEssence () {
  }
}
