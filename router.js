const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")
const itemController = require("./controllers/itemController")

// error
// user related routes
router.get("/", userController.home)
router.get("/learn-more", userController.learnMore)
router.post("/register", userController.register)
router.post("/login", userController.login)
router.post("/logout", userController.logout)
router.post("/doesUsernameExist", userController.doesUsernameExist)
router.post("/doesEmailExist", userController.doesEmailExist)
router.get("/profile/:username", userController.mustBeLoggedIn, userController.ifUserExists, userController.profilePostsScreen)

router.get("/settings/:username", userController.mustBeLoggedIn, userController.ifUserExists, userController.viewSettingsScreen)
router.post("/settings/:username", userController.edit)

//item related routes
router.get("/create-item", userController.mustBeLoggedIn, itemController.viewCreateScreen)
router.post("/create-item", userController.mustBeLoggedIn, itemController.create)

/* router.get("/item/:id", itemController.viewSingle) */
router.get("/item/:id/edit", userController.mustBeLoggedIn, itemController.viewEditScreen)
router.post("/item/:id/edit", userController.mustBeLoggedIn, itemController.edit)
router.post("/item/:id/delete", userController.mustBeLoggedIn, itemController.delete)

module.exports = router
