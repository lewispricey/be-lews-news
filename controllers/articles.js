const articles = require("../db/data/test-data/articles")
const { fetchArticle, updateArticle, fetchArticles } = require("../models/articles")


exports.getArticle = (req, res, next) => {
    fetchArticle(req.params)
    .then((article) => res.status(200).send(article))
    .catch((err) => next(err))
}

exports.patchArticle = (req, res, next) => {
    updateArticle(req.params, req.body)
    .then((updatedArticle) => res.status(200).send(updatedArticle))
    .catch((err) => next(err))
}

exports.getArticles = (req, res, next) => {
    fetchArticles()
    .then((articles) => res.status(200).send({articles}))
    .catch((err) => next(err))
}