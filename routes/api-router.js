const apiRouter = require('express').Router()
const { getApi } = require('../controllers/api')
const articlesRouter = require('./articles-router')
const commentsRouter = require('./comments-router')
const topicsRouter = require('./topics-router')
const usersRouter = require('./users-router')

apiRouter.get('/', getApi)
apiRouter.use('/topics', topicsRouter)
apiRouter.use('/articles', articlesRouter)
apiRouter.use('/users', usersRouter)
apiRouter.use('/comments', commentsRouter)

module.exports = apiRouter
