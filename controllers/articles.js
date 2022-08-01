const { fetchArticle } = require("../models/articles")


exports.getArticle = (req, res, next) => {
    fetchArticle(req.params)
    .then((article) => {
        res.status(200).send(article)
    })
    .catch((err) => {
        return next(err)})
}