const { getUsers, getUser, postUser, patchUser } = require('../controllers/users')

const usersRouter = require('express').Router()
usersRouter.get('/', getUsers)
usersRouter.post('/', postUser)
usersRouter.get('/:username', getUser)
usersRouter.patch('/:username', patchUser)


module.exports = usersRouter