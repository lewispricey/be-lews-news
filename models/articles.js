const db = require("../db/connection")
const { checkExists, makeQuery, checkUserRequest } = require("../utilities/utils")

exports.fetchArticle = ({article_id}) => {
    return db
    .query(`
        SELECT articles.article_id, title, topic, articles.author, articles.body, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
        FROM articles 
        LEFT JOIN comments ON articles.article_id = comments.article_id 
        WHERE articles.article_id = $1
        GROUP BY articles.article_id;`, [parseInt(article_id)])
    .then(({rows}) => {
        if(rows.length === 0){
            return Promise.reject({status: 404, msg: "Requested data not found"})
        }
        return rows[0]
    })
}

exports.createArticle = (submittedArticle) => {
    const {author, title, body, topic} = submittedArticle
    return db
    .query(`
        INSERT INTO articles
        (author, title, body, topic)
        VALUES
        ($1, $2, $3, $4) RETURNING*;`, [author, title, body, topic])
    .then(({rows}) => {
        rows[0].comment_count = 0
        return rows[0]
    })
}

exports.updateArticle = ({article_id}, body) => {
    return db
    .query('UPDATE articles SET votes=votes+$1 WHERE article_id=$2 RETURNING*;', [body.inc_votes, article_id])
    .then(({rows}) => {
        const article = rows[0]
        if(!article){
            return Promise.reject({status: 404, msg: "Requested data not found"})
        }
        return article
    })
}

exports.fetchArticles = async (usrQuerys) => {    
    usrQuerys.limit === undefined ? usrQuerys.limit = 10 : usrQuerys.limit
    await checkUserRequest(usrQuerys)
    const queryString = makeQuery(usrQuerys)
    if(usrQuerys.topic){
        await checkExists('topics', 'slug', usrQuerys.topic)
        return db
        .query(queryString, [usrQuerys.limit, usrQuerys.topic])
        .then(({rows}) => rows)
    }
    return db
    .query(queryString, [usrQuerys.limit])
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
    if(!username || !body) Promise.reject(next({status: 400, msg: "Invalid Request"}))
    await checkExists('articles', 'article_id', id)
    await checkExists('users', 'username', username)
    return db
    .query(`
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3) RETURNING*;`, [username, body, id])
    .then(({rows}) => rows[0])
}

exports.removeArticle = (id) => {
    return db
    .query(`
    DELETE FROM articles
    WHERE article_id = $1
    RETURNING*;`, [id])
    .then(({rows}) => {
        if(rows.length === 0) return Promise.reject({status: "404", msg: "Requested data not found"})
        return rows[0]
    })
}

exports.fetchArticlesBySearch = (searchTerm) => {
    const formattedSearchTerm = `%${String(searchTerm)}%`
    return db
    .query(`
    SELECT* 
    FROM articles 
    WHERE body ILIKE $1;`, [formattedSearchTerm])
    .then(({rows}) => {
        if(rows.length === 0) return Promise.reject({status: "404", msg: "No Content"})
        return rows
    })
}