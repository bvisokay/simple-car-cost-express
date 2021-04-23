const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")
const itemController = require("./controllers/itemController")

// user related routes
router.get("/", userController.home)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/logout", userController.logout)
router.post("/doesUsernameExist", userController.doesUsernameExist)
router.post("/doesEmailExist", userController.doesEmailExist)
router.get("/:username", userController.ifUserExists, userController.profilePostsScreen)

//item related routes
router.get("/create-item", userController.mustBeLoggedIn, itemController.viewCreateScreen)
router.post("/create-item", userController.mustBeLoggedIn, itemController.create)
router.get("/item/:id", itemController.viewSingle)

module.exports = router
