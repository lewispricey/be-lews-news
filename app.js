const express = require("express")
const { getArticle } = require("./controllers/articles")
const { getTopics } = require("./controllers/topics")


const app = express()

app.get('/api/topics', getTopics)

app.get('/api/articles/:article_id', getArticle)

app.use((err, req, res, next) => {
    if(err.status){
        res.status(err.status).send({msg: err.msg})
    } else{
        res.status(400).send()
    }
})

module.exports = app