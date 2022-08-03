const format = require("pg-format")
const db = require("../db/connection")

exports.checkExists = async (table, column, value) => {
    const queryString = format('SELECT * FROM %I WHERE %I = $1;', table, column)
    const output = await db.query(queryString, [value])
    if(output.rows.length === 0){
        return Promise.reject({status: 404, msg: "Requested ID not found"})
    } 
}