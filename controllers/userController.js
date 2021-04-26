const User = require("../models/User")
const Item = require("../models/Item")

exports.mustBeLoggedIn = function (req, res, next) {
  if (req.session.user) {
    next()
  } else {
    req.flash("errors", "You must be logged in to perform that action.")
    req.session.save(function () {
      res.redirect("/")
    })
  }
}

exports.doesUsernameExist = function (req, res) {
  User.findByUsername(req.body.username)
    .then(function () {
      res.json(true)
    })
    .catch(function () {
      res.json(false)
    })
}

exports.doesEmailExist = async function (req, res) {
  let emailBool = await User.doesEmailExist(req.body.email)
  res.json(emailBool)
}

exports.login = function (req, res) {
  let user = new User(req.body)
  user
    .login()
    .then(function (result) {
      // add new properties onto a session object
      // (.user property is an object that could be set to anything)
      // stores session data in server memory by default
      // set session data in db using package connect-mongo (we do this in app.js)
      // removed  avatar: user.avatar,
      req.session.user = { username: user.data.username, _id: user.data._id  }
      // tell session to manually save using save method with callback function
      // remember a db process can take a bit to complete action
      req.session.save(function () {
        // send back result
        res.redirect(`/profile/${req.session.user.username}`)
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
      //removed user.avatar
      req.session.user = { username: user.data.username, _id: user.data._id }
      // since the above action may take a while to save in db
      // manually tell session to save
      req.session.save(function () {
        // redirect back to home page url
        res.redirect(`/profile/${req.session.user.username}`)
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
    res.redirect(`/profile/${req.session.user.username}`)
  } else {
    // also pass data from errors and regErrors arrays into the home-guest template
    res.render("home-guest", {regErrors: req.flash("regErrors") })
  }
}

exports.learnMore = function (req, res) {
    res.render("learn-more")
}


exports.ifUserExists = function(req, res, next) {
  User.findByUsername(req.params.username).then((userDocument) => {
    req.profileUser = userDocument
    next()
  }).catch(() => {
    res.render('404')
  })
}


exports.profilePostsScreen = function(req, res) {
  // only if visitor is the owner then show the page
  // else show a 404 page with a flash message
  if (req.params.username == req.session.user.username) {
    // ask our item model for items by a certain author id
    Item.findByAuthorId(req.profileUser._id).then(function(items) {
      // notice the passage of data to show profile name on the profile screen template
      res.render('profile', {
        items: items,
        profileUsername: req.profileUser.username
        // profileAvatar: req.profileUser.avatar
        
        })
      }).catch(function() {res.render("404")})
  } else {
    req.flash("errors", "You do not have permission to perform that action.")
    req.session.save(() => res.redirect("404"))
  }
}


        


