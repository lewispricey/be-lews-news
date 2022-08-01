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
    .catch((err) => Promise.reject(err))
}