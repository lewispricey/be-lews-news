const express = require("express")
const { customError, standardError } = require("./errors/error-handling")
const apiRouter = require("./routes/api-router")
const cors = require('cors');

const app = express()
app.use(cors());
app.use(express.json())

app.use('/api', apiRouter)

app.use(customError)
app.use(standardError)

module.exports = app