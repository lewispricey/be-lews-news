const e = require("express")
const db = require("../db/connection")

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
    console.log("model")
    return db
    .query(`
        SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
        FROM articles 
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY articles.created_at DESC;`)
    .then(({rows}) => {
        console.log(rows)
        return rows
    })
}