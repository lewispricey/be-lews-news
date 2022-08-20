const format = require("pg-format")
const { query } = require("../db/connection")
const db = require("../db/connection")

exports.checkExists = async (table, column, value) => {
    const queryString = format('SELECT * FROM %I WHERE %I = $1;', table, column)
    const output = await db.query(queryString, [value])
    if(output.rows.length === 0){
        return Promise.reject({status: 404, msg: `Requested data not found`})
    } 
}

exports.checkUserRequest = (querys) => {
    const acceptedSorts = [undefined, "title", "topic", "author", "created_at", "votes", "article_id"]
    if(!acceptedSorts.includes(querys.sort_by)){
        return Promise.reject({status: 400, msg: "Invalid Request"})
    }
    const acceptedOrders = [undefined, "ASC", "asc", "desc", "DESC"]
    if(!acceptedOrders.includes(querys.order)){
        return Promise.reject({status: 400, msg: "Invalid Request"})
    }
}


exports.makeQuery = (usrQuerys) => {
    if(!usrQuerys.order) usrQuerys.order = "DESC"
    // usrQuerys.order === "asc" || usrQuerys.order === "ASC" ? usrQuerys.order = "ASC" : usrQuerys.order = "DESC"
    usrQuerys.sort_by ? usrQuerys.sort_by = "articles." + usrQuerys.sort_by : usrQuerys.sort_by = "articles.created_at";
            
    const qryStart = `
    SELECT articles.article_id, title, topic, articles.author, articles.created_at, articles.votes, COUNT(comment_id) AS comment_count FROM articles 
    LEFT OUTER JOIN comments ON articles.article_id = comments.article_id`
    const where =`WHERE articles.topic = $2`
    const qryEnd = `
    GROUP BY articles.article_id 
    ORDER BY %s %s
    LIMIT $1;`    

    if(usrQuerys.topic){
        const queryString = format(`${qryStart} ${where} ${qryEnd}`, usrQuerys.sort_by, usrQuerys.order.toUpperCase())
        return queryString
    }
                
    const queryString = format(`${qryStart} ${qryEnd}`, usrQuerys.sort_by, usrQuerys.order.toUpperCase())
    return queryString
}       