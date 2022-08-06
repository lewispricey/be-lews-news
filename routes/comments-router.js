const { deleteComment, patchCommentVotes } = require('../controllers/comments')
const commentsRouter = require('express').Router()

commentsRouter.delete('/:comment_id', deleteComment)
commentsRouter.patch('/:comment_id', patchCommentVotes)

module.exports = commentsRouter