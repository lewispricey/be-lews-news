const express = require("express")
const { getApi } = require("./controllers/api")
const { getArticle, patchArticle, getArticles, getComments, postComment } = require("./controllers/articles")
const { deleteComment } = require("./controllers/comments")
const { getTopics } = require("./controllers/topics")
const { getUsers } = require("./controllers/users")
const { customError, standardError } = require("./errors/error-handling")


const app = express()
app.use(express.json())

app.get('/api', getApi)

app.get('/api/topics', getTopics) //done

app.get('/api/articles', getArticles) //done
app.get('/api/articles/:article_id', getArticle) //done
app.patch('/api/articles/:article_id', patchArticle) //done
app.get('/api/articles/:article_id/comments', getComments) //done
app.post('/api/articles/:article_id/comments', postComment) //done

app.get('/api/users', getUsers)

app.delete('/api/comments/:comment_id', deleteComment)

//////////////////////////////////////////

app.use(customError)
app.use(standardError)

module.exports = app