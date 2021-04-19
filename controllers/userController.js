const User = require("../models/User")

exports.login = function () {}

exports.logout = function () {}

exports.register = function (req, res) {
  //create new object using User as its blueprint
  let user = new User(req.body)
  //calls the user's register method
  user.register()
  // if there are any errors show them
  if (user.errors.length) {
    res.send(user.errors)
  } else {
    res.send("Congrats, no errors.")
  }
}

exports.home = function (req, res) {
  res.render("home-guest")
}
