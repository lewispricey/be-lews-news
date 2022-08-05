const { getArticles, getArticle, patchArticle, getComments, postComment } = require('../controllers/articles')

const articlesRouter = require('express').Router()

articlesRouter.get('/', getArticles)
articlesRouter.get('/:article_id', getArticle)
articlesRouter.patch('/:article_id', patchArticle)
articlesRouter.get('/:article_id/comments', getComments)
articlesRouter.post('/:article_id/comments', postComment)

module.exports = articlesRouter