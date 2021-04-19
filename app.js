const express = require("express")
const app = express()

// tell our express server to make views folder accessible
app.use(express.static("public"))

//let express know where to look to find our templates
app.set("views", "views")

// let express know which templating engine we are using
app.set("view engine", "ejs")

app.get("/", function (req, res) {
  res.render("home-guest")
})

app.listen(3000)
