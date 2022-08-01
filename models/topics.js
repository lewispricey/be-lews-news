const db = require("../db/connection")

exports.fetchTopics = () => {
    // console.log("reached model!")
    return db
    .query("SELECT * FROM topics")
    .then(({rows}) => rows)
}

