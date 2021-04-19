const express = require("express")
const app = express()

const router = require("./router")

// boiler plate code - no need to remember
// tells express to add a bit of data onto request object so it can be accessed from request.body
app.use(express.urlencoded({ extended: false }))

// tells express to use JSON
app.use(express.json())

// tell our express server to make views folder accessible
app.use(express.static("public"))

//let express know where to look to find our templates
app.set("views", "views")

// let express know which templating engine we are using
app.set("view engine", "ejs")

// tell express to use the router file we set up
app.use("/", router)

module.exports = app
