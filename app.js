const express = require("express")
const { getArticle, patchArticle } = require("./controllers/articles")
const { getTopics } = require("./controllers/topics")


const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)
app.patch('/api/articles/:article_id', patchArticle)

app.use((err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    }
    next(err)
})

app.use((err, req, res, next) => {
    res.status(400).send({msg: err})
})

module.exports = app