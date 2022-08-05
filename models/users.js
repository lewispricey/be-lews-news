const db = require("../db/connection")

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users;').then(({rows}) => rows)
}

exports.fetchUser = (username) => {
    return db
    .query('SELECT username, avatar_url, name FROM users WHERE username = $1;', [username])
    .then(({rows}) => {
        if(!rows[0]){
            return Promise.reject({status: 404, msg: "Requested data not found"})
        }
        return rows[0]
    })
}