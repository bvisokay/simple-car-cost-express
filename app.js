const express = require("express")
// needed to leverage sessions to remember users
const session = require("express-session")
// needed to store session data in db instead of the default (storage in server memory)
const MongoStore = require("connect-mongo")(session)
const flash = require("connect-flash")
const app = express()

// set up configuration object for sessions
// not worth memorizing boilerplate
let sessionOptions = session({
  // something someone couldn't guess
  secret: "Javascript is sooooooo cool",
  // store: overrides default to store session data in memory
  store: new MongoStore({ client: require("./db") }),
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24, httpOnly: true }
})

// tell express to actualy use sessions/sessionOptions
app.use(sessionOptions)

// tell express to use the flash package
app.use(flash())

// bring in router
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
