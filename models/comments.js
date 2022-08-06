const db = require("../db/connection")
exports.removeCommentById = (commentId) => {
    return db
    .query('DELETE FROM comments WHERE comment_id = $1', [commentId])
    .then(({rowCount}) => {
        if(rowCount === 0) return Promise.reject({status: 404, msg: "Requested data not found"})
        return
    })
}

exports.updateCommentVotes = (commentId, vote) => {
    return db
    .query(`UPDATE comments SET votes=votes+$1 WHERE comment_id=$2 RETURNING*`, [vote, commentId])
    .then(({rows}) => {
        if(!rows[0]) return Promise.reject({status: 404, msg: "Requested data not found"})
        return rows[0]
    })
}
