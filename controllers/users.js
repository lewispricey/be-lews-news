const { fetchUsers, fetchUser, addUser, updateUserPic } = require("../models/users")

exports.getUsers = (req, res, next) => {
    fetchUsers().then((users) => res.status(200).send({users}))
}

exports.postUser = (req, res, next) => {
    addUser(req.body)
    .then((user) => res.status(201).send({user}))
    .catch((err) => next(err))
}

exports.getUser = (req, res, next) => {
    fetchUser(req.params.username)
    .then((user) => res.status(200).send({user:user}))
    .catch((err) => next(err))
}

exports.patchUser = (req, res, next) => {
    updateUserPic(req.params.username, req.body)
    .then((user) => res.status(200).send({user: user}))
    .catch((err) => next(err))
}