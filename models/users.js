const db = require("../db/connection")

exports.fetchUsers = () => {
    return db.query('SELECT * FROM users;').then(({rows}) => rows)
}

exports.addUser = ({username, avatar_url, name}) => {
    return db
    .query(`
        INSERT INTO users
        (username, name, avatar_url)
        VALUES
        ($1, $2, $3) RETURNING*;`, [username, name, avatar_url])
    .then(({rows}) => rows[0])
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

exports.updateUserPic = (username, {avatar_url}) => {
    return db
    .query(`
    UPDATE users 
    SET avatar_url = $1 
    WHERE username = $2 
    RETURNING*;`, [avatar_url, username])
    .then(({rows}) => rows[0])
}