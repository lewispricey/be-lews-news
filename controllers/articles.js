const { fetchArticle, updateArticle } = require("../models/articles")


exports.getArticle = (req, res, next) => {
    fetchArticle(req.params)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        next(err)})
}

exports.patchArticle = (req, res, next) => {
    updateArticle(req.params, req.body)
    .then((updatedArticle) => {
       res.status(200).send(updatedArticle) 
    })
    .catch((err) => next(err))
}