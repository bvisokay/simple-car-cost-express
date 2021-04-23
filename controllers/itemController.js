const Item = require("../models/Item")

exports.viewCreateScreen = function (req, res) {
  res.render("create-item")
}

exports.create = function (req, res) {
  // req.body contains form data the user just submitted
  let item = new Item(req.body, req.session.user._id)
  // this method will be set up to return a promise
  item
    .create()
    .then(function () {
      res.send("New car item created.")
    })
    .catch(function (errors) {
      res.send(errors)
    })
}

exports.viewSingle = async function(req, res) {
    try {
      // leverage Item model and tell it to find an item
      // first param of req.params.id tells it which post to lookup for current url
      // second param req.visitorId helps determine if visitor is the author of the post
      let item = await Item.findSingleById(req.params.id, req.visitorId)
       res.render('single-post-screen', {item: item})
      } catch {
       res.render("404")
    }
}


exports.viewEditScreen = async function(req, res) {
  try {
    let item = await Item.findSingleById(req.params.id)
  res.render("edit-item", {item: item})
  } catch {
    res.render("404")
  }
}

exports.edit = function(req, res) {
  let item = new Item(req.body, req.visitorId, req.params.id)
  item.update().then((status) => {
    // the post was successfully updated in the database
    // or the user did have permission, but there were validation errors
    if(status == "success") {
      //post was updated in the database
      req.flash("success", "Car item was successfully updated.")
      req.session.save(function() {
        res.redirect(`/item/${req.params.id}/edit`)
      })
    } else {
      // user had permission but validation errors
      item.errors.forEach(function(error) {
        req.flash("errors", error)
      })
        req.session.save(function() {
          res.redirect(`/item/${req.params.id}/edit`)
        })
    }

  }).catch(() => {
    // if a post with requested id doesn't exit
    // or if the current visitor is not the owner
    req.flash("errors", "You do not have permission to perform that action")
    req.session.save(function() {
      res.redirect('/')
    })
  })
}
