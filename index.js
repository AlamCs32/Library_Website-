const express = require("express")
const errorHandler = require("./middleware/globelErrorHandler")
const router = require('./router')
require('./config/dbConfig') // Data Base Connection 
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

// Application Routing 
app.use(router)
// Globel Error Handler
app.use(errorHandler)

const port = process.env.PORT || 3000
app.listen(port, _ => console.log(`Server is live at http://localhost:${port}`))