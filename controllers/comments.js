const { removeCommentById } = require("../models/comments")

exports.deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id
    removeCommentById(commentId)
    .then((body) => res.status(204).send(body))
    .catch((err) => next(err))
}