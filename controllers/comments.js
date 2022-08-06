const { removeCommentById, updateCommentVotes } = require("../models/comments")

exports.deleteComment = (req, res, next) => {
    const commentId = req.params.comment_id
    removeCommentById(commentId)
    .then((body) => res.status(204).send(body))
    .catch((err) => next(err))
}

exports.patchCommentVotes = (req, res, next) => {
    updateCommentVotes(req.params.comment_id, req.body.inc_votes)
    .then((output) => res.status(200).send({comment: output}))
    .catch((err) => next(err))
}