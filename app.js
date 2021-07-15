const express = require("express")
// needed to leverage sessions to remember users
const session = require("express-session")
// needed to store session data in db instead of the default (storage in server memory)
const MongoStore = require("connect-mongo")(session)
// needed to have flash messages
const flash = require("connect-flash")
// needed to protect against csrf attacks
const csrf = require("csurf")
// needed for express
const app = express()

// manually enforce https (snippet from jake trent site)
// breaks localhost so I comment this out while working locally
// and often forget to bring back in before re-deploying
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") res.redirect(`https://${req.header("host")}${req.url}`)
    else next()
  })
}

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

//app.use() tells express to run that function for every request

// tell express to actualy use sessions/sessionOptions
app.use(sessionOptions)

// tell express to use the flash package
app.use(flash())

// custom middleware
// this will run for all of our routes before functions listed in router
// this is also where you can pass data to routes???
app.use(function (req, res, next) {
  // make all error and sucess flash messages available to all templates
  res.locals.errors = req.flash("errors")
  res.locals.success = req.flash("success")

  //make current user id available on the req object
  if (req.session.user) {
    req.visitorId = req.session.user._id
  } else {
    req.visitorId = 0
  }
  //makes user session data available within view templates
  res.locals.user = req.session.user
  next()
})

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

// tell express to make sure any request has a valid matching csrf token
app.use(csrf())

// make the csrf token available within templates
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken()
  next()
})

// tell express to use the router file we set up
app.use("/", router)

// csrf message
app.use(function (err, req, res, next) {
  if (err) {
    if (err.code == "EBADCSRFTOKEN") {
      req.flash("errors", "Cross Site Request Forgery Detected.")
      req.session.save(() => res.redirect("/"))
    } else {
      res.render("404")
    }
  }
})

module.exports = app
