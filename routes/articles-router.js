const { getArticles, getArticle, patchArticle, getComments, postComment, postArticle, deleteArticle, getArticlesBySearch } = require('../controllers/articles')
const articles = require('../db/data/test-data/articles')

const articlesRouter = require('express').Router()

articlesRouter.get('/', getArticles)
articlesRouter.post('/', postArticle)
articlesRouter.get('/:article_id', getArticle)
articlesRouter.patch('/:article_id', patchArticle)
articlesRouter.get('/:article_id/comments', getComments)
articlesRouter.post('/:article_id/comments', postComment)
articlesRouter.delete('/:article_id', deleteArticle)
articlesRouter.get('/search/:search_term', getArticlesBySearch)


module.exports = articlesRouter