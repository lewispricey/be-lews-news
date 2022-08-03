const format = require("pg-format")
const db = require("../db/connection")
const articles = require("../db/data/test-data/articles")

exports.checkExists = async (table, column, value) => {
    const queryString = format('SELECT * FROM %I WHERE %I = $1;', table, column)
    const output = await db.query(queryString, [value])
    if(output.rows.length === 0){
        return Promise.reject({status: 404, msg: `Requested data not found`})
    } 
}

exports.generateArticleQuery = async (sort, order, topic) => {
    if(topic.length > 0){
        return queryString = format(`
                SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
                FROM articles 
                LEFT OUTER JOIN comments ON articles.article_id = comments.article_id 
                WHERE articles.topic = $1
                GROUP BY articles.article_id 
                ORDER BY %s %s`, sort, order)
    } else{
        return queryString = format(`
        SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
        FROM articles 
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY %s %s`, sort, order)
    }

}

exports.makeQuery = (usrQuerys) => {
//need to preface the arguemnts with articles.
    if(!usrQuerys.order) usrQuerys.order = "DESC"
    usrQuerys.sort_by ? usrQuerys.sort_by = "articles." + usrQuerys.sort_by : usrQuerys.sort_by = "articles.created_at";
    console.log(usrQuerys.sort_by)
    const queryString = format(`
        SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
        FROM articles 
        LEFT OUTER JOIN comments ON articles.article_id = comments.article_id 
        GROUP BY articles.article_id 
        ORDER BY %s %s;`, usrQuerys.sort_by, usrQuerys.order.toUpperCase())
    console.log(queryString)
    return queryString
}//seperate query string out and concat with or without the where statement instead of writing it out twice?


//for topic
// SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count 
// FROM articles 
// LEFT OUTER JOIN comments ON articles.article_id = comments.article_id 
// WHERE articles.topic = $1
// GROUP BY articles.article_id 
// ORDER BY articles.created_at %s;`, usrQuerys.order.toUpperCase())