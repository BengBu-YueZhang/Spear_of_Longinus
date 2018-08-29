const mongoose = require('mongoose')
const PostSchema = require('../schema/post.scheam')
const Post = mongoose.model('Post', PostSchema)

module.exports = Post
