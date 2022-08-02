const db = require("../db/connection")

exports.fetchArticle = ({article_id}) => {
    return db
    .query('SELECT * FROM articles WHERE article_id = $1', [article_id])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Requested ID not found..."})
        }
        return rows[0]
    })
}

exports.updateArticle = ({article_id}, body) => {
    return db
    .query('UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING*;', [body.inc_votes, article_id])
    .then(({rows}) => {
        const article = rows[0]
        if(!article){
            return Promise.reject({status: 404, msg: "Requested ID not found"})
        }
        return article
    })
}
