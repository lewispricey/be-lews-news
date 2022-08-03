const db = require("../db/connection")
const { checkExists } = require("../utilities/utils")

exports.fetchArticle = ({article_id}) => {
    return db
    .query(`
        SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
        FROM articles 
        JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id=$1 GROUP BY articles.article_id;`, [article_id])
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

exports.fetchArticles = () => {
    return db
    .query(`
        SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
        FROM articles 
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;`)
    .then(({rows}) => rows)
}

exports.fetchComments = (id) => {
    return db
    .query(`SELECT comment_id, votes, created_at, author, body FROM comments WHERE article_id = $1;`, [id])
    .then(async ({rows}) => {
        if(rows.length === 0){
            await checkExists('articles', 'article_id', id)
        }
        return rows
    })
}

exports.addComment = async (id, newComment) => {
    const {username, body} = newComment 
    await checkExists('articles', 'article_id', id)
    return db
    .query(`
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3) RETURNING*;`, [username, body, id])
    .then(({rows}) => rows[0])
}
