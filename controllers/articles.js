const { fetchArticle, updateArticle, fetchArticles, fetchComments, addComment, createArticle, removeArticle, fetchArticlesBySearch } = require("../models/articles")


exports.getArticle = (req, res, next) => {
    fetchArticle(req.params)
    .then((article) => res.status(200).send({article}))
    .catch((err) => next(err))
}

exports.postArticle = (req, res, next) => {
    createArticle(req.body)
    .then((newArticle) => res.status(201).send({article: newArticle}))
    .catch((err) => next(err))
}

exports.patchArticle = (req, res, next) => {
    updateArticle(req.params, req.body)
    .then((updatedArticle) => res.status(200).send(updatedArticle))
    .catch((err) => next(err))
}

exports.getArticles = (req, res, next) => {
    fetchArticles(req.query)
    .then((articles) => res.status(200).send({articles}))
    .catch((err) => next(err))
}

exports.getComments = (req, res, next) => {
    const id = req.params.article_id
    fetchComments(id)
    .then((comments) => res.status(200).send({comments}))
    .catch((err) => next(err))
}

exports.postComment = (req, res, next) => {
    const id = req.params.article_id
    const newComment = req.body
    addComment(id, newComment)
    .then((comment) => res.status(201).send({"newComment": comment}))
    .catch((err) => next(err))
}

exports.deleteArticle = (req, res, next) => {
    const id = req.params.article_id
    removeArticle(id).then((data) => res.status(204).send({"test": data}))
    .catch((err) => next(err))
}

exports.getArticlesBySearch = (req, res, next) => {
    const searchTerm = req.params.search_term
    fetchArticlesBySearch(searchTerm).then((articles) => res.status(200).send({articles}))
    .catch((err) => next(err))
}