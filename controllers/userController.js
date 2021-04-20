const User = require("../models/User")

exports.login = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      // add new properties onto a session object
      // (.user property is an object that could be set to anything)
      // stores session data in server memory by default
      // set session data in db using package connect-mongo (we do this in app.js)
      req.session.user = { username: user.data.username }
      // tell session to manually save using save method with callback function
      // remember a db process can take a bit to complete action
      req.session.save(function () {
        // send back result
        res.redirect("/")
      })
    })
    .catch(function (e) {
      // leverage flash package for failed login attempt using e from failed promise
      // flash package adds a flash object to the session object
      req.flash("errors", e)
      //manually tell session to save to
      req.session.save(function () {
        // redirect to homepage if login fails
        res.redirect("/")
      })
    })
}

exports.logout = function (req, res) {
  // if incoming browser request has a cookie with a valid or matching session id
  // the destroy method will find it in our database and destory that session
  // provide a callback function to destroy (don't think session methods return promises)
  req.session.destroy(function () {
    // redirect to home-guest template
    res.redirect("/")
  })
}

exports.register = function (req, res) {
  //create new object using User as its blueprint
  let user = new User(req.body)
  //calls the user's register method
  user
    .register()
    .then(() => {
      //redirect to homepage but update their session data so actually logged in
      req.session.user = { username: user.data.username }
      // since the above action may take a while to save in db
      // manually tell session to save
      req.session.save(function () {
        // redirect back to home page url
        res.redirect("/")
      })
    })
    .catch(regErrors => {
      // use flash package to add errors (as an array of messages) to session data
      regErrors.forEach(function (error) {
        req.flash("regErrors", error)
      })
      // since the above action may take a while to save in db
      // manually tell session to save
      req.session.save(function () {
        // redirect back to home page url
        res.redirect("/")
      })
    })
}

exports.home = function (req, res) {
  // if current visitor or browser has session data associated with it
  // show them custom data else show them the guest template
  if (req.session.user) {
    // also pass data into that template (username: could be called anything)
    res.render("home-dashboard", { username: req.session.user.username })
  } else {
    // also pass data from errors and regErrors arrays into the home-guest template
    res.render("home-guest", { errors: req.flash("errors"), regErrors: req.flash("regErrors") })
  }
}
