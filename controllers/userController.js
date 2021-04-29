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
      // session data set in db using package connect-mongo (we do this in app.js)
      req.session.user = { username: user.data.username, _id: user.data._id, useful_miles: user.data.useful_miles, monthly_miles: user.data.monthly_miles }
      // tell session to manually save using save method 
      // using callback function since db process can take a bit to complete action
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
      req.session.user = { username: user.data.username, _id: user.data._id, useful_miles: user.data.useful_miles, monthly_miles: user.data.monthly_miles }
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
      res.render('profile', {
        items: items,
        profileUsername: req.profileUser.username
        })
        //console.log(items)
      }).catch(function() {res.render("404")})
  } else {
    req.flash("errors", "You do not have permission to perform that action.")
    req.session.save(() => res.redirect("404"))
  }
}

exports.viewSettingsScreen = function(req, res) {
  // only if visitor is the owner then show the page
  if (req.params.username == req.session.user.username) {
    // ask our user model for properties attached to certain username
    User.findByUsername(req.profileUser.username).then(function() {
      res.render("settings", {
        profileUsername: req.profileUser.username,
        profileUsefulMiles: req.profileUser.useful_miles,
        profileMonthlyMiles: req.profileUser.monthly_miles
      })
    }).catch(function() {res.render("404")})
 } else {
    // if the visitor is not the owner then this will run
    req.flash("errors", "You do not have permission to perform that action.")
    req.session.save(() => res.redirect("404"))
  } // closes else block
} // closes viewSettingsScreenFunction


/// Customizing User Settings
exports.edit = function(req, res) {
  //console.log("Edit function ran")
  let user = new User(req.body, req.params.username)

  // pssing the update function requestedUsername and visitorUsername
  user.update(req.params.username, req.session.user.username).then((status) => {
    //console.log("Then function ran in Edit Function")
    //console.log("Status came back as: " + status)
    // the settings were successfully updated in the database
    // or the user did have permission, but there were validation errors
    if(status == "success") {
      // console.log("If Block Ran since status was 'success'")
      // settings were successfully updated in the database
      // log user out for changes to take effect on login

      res.redirect(`/settings/${req.params.username}`)
      /* req.session.destroy(function () {
        // redirect to home-guest template
        res.redirect("/")
      }) */


    } else {
      // user had permission but there were validation errors
      // console.log("Else Block Ran in Edit function")
      user.errors.forEach(function(error) {
        req.flash("errors", error)
      })
        req.session.save(function() {
          res.redirect(`/settings/${req.params.username}`)
        })
    } // closes else block
  }).catch(() => {
    // console.log("Catch Function Ran in Edit Function")
    // if a user with requested id doesn't exit
    // or if the current visitor is not the owner
    req.flash("errors", "You do not have permission to perform that action")
    req.session.save(function() {
      /* res.redirect('/') */
      res.send("catch block ran in Update function")
      })
  }) // Closes Catch
} //Closes Update



        


