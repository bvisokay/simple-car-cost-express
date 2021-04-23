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
