const { fetchUsers, fetchUser } = require("../models/users")

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => res.status(200).send({users}))
}

exports.getUser = (req, res, next) => {
    fetchUser(req.params.username)
    .then((user) => res.status(200).send({user}))
    .catch((err) => next(err))
}