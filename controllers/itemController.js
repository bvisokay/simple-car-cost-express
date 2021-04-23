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
      let item = await Item.findSingleById(req.params.id)
       res.render('single-post-screen', {item: item})
      } catch {
       res.render("404")
    }
}
