const express = require("express")
const { getArticle, patchArticle, getArticles, getComments, postComment } = require("./controllers/articles")
const { getTopics } = require("./controllers/topics")
const { getUsers } = require("./controllers/users")


const app = express()
app.use(express.json())

app.get('/api/topics', getTopics)

app.get('/api/articles', getArticles)
app.get('/api/articles/:article_id', getArticle)
app.patch('/api/articles/:article_id', patchArticle)
app.get('/api/articles/:article_id/comments', getComments)
app.post('/api/articles/:article_id/comments', postComment)

app.get('/api/users', getUsers)

//////////////////////////////////////////

app.use((err, req, res, next) => {
    if(err.status) res.status(err.status).send({msg: err.msg})
    next(err)
})
app.use((err, req, res, next) => {
    res.status(400).send({msg: "Invalid Request"})
})

module.exports = app
