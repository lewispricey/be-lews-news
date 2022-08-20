const { getUsers, getUser, postUser } = require('../controllers/users')

const usersRouter = require('express').Router()
usersRouter.get('/', getUsers)
usersRouter.post('/', postUser)
usersRouter.get('/:username', getUser)


module.exports = usersRouter