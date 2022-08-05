const express = require("express")
const { customError, standardError } = require("./errors/error-handling")
const apiRouter = require("./routes/api-router")

const app = express()
app.use(express.json())

app.use('/api', apiRouter)

app.use(customError)
app.use(standardError)

module.exports = app