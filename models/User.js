const bcrypt = require("bcryptjs")
// when configuring storing sessions into db had to add .db() before collection
const usersCollection = require("../db").db().collection("users")
// helps validate user registration form
const validator = require("validator")

let User = function (data) {
  this.data = data
  this.errors = []
}

User.prototype.cleanUp = function () {
  // get rid of anything other than a string
  if (typeof this.data.username != "string") {
    this.data.username = ""
  }
  if (typeof this.data.email != "string") {
    this.data.email = ""
  }
  if (typeof this.data.password != "string") {
    this.data.password = ""
  }

  // get rid of any empty spaces and lowercase
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    //password doesn't need
    password: this.data.password
  }
}

User.prototype.validate = function () {
  return new Promise(async (resolve, reject) => {
    if (this.data.username == "") {
      this.errors.push("You must provide a username.")
    }
    if (this.data.username != "" && !validator.isAlphanumeric(this.data.username)) {
      this.errors.push("Username can only contain letters and numbers.")
    }
    if (!validator.isEmail(this.data.email)) {
      this.errors.push("You must provide an email.")
    }
    if (this.data.password == "") {
      this.errors.push("You must provide a password.")
    }
    if (this.data.password.length > 0 && this.data.password.length < 12) {
      this.errors.push("Password must be at least 8 characters.")
    }
    if (this.data.password.length > 50) {
      this.errors.push("Password cannot exceed 50 characters.")
    }
    if (this.data.username.length > 0 && this.data.password.length < 3) {
      this.errors.push("Username must be at least 3 characters.")
    }
    if (this.data.username.length > 30) {
      this.errors.push("Username cannot exceed 30 characters.")
    }

    // Only if username is valid then check to see if it's already taken
    if (this.data.username.length > 2 && this.data.username.length < 31 && validator.isAlphanumeric(this.data.username)) {
      // find a username in the users collection the database
      // that one that matches whatever the user tried to registers with
      // this action takes time so subsequent actions need to wait
      // findOne and other mongo methods return promises which is reason for await
      // await means .validate function needs to be async
      let usernameExists = await usersCollection.findOne({ username: this.data.username })
      if (usernameExists) {
        this.errors.push("That username is already taken")
      }
    }

    // Only if email is valid then check to see if it's already taken
    if (validator.isEmail(this.data.email)) {
      // find a email in the users collection in the database
      // the one that matches whatever the user tried to registers with
      // this action takes time so subsequent actions need to wait
      // findOne and other mongo methods return promises which is reason for await
      // await means .validate function needs to be async
      let emailExists = await usersCollection.findOne({ email: this.data.email })
      if (emailExists) {
        this.errors.push("That email is already registered")
      }
    }
    resolve()
  })
}

User.prototype.login = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    usersCollection
      .findOne({ username: this.data.username })
      .then(attemptedUser => {
        if (attemptedUser && bcrypt.compareSync(this.data.password, attemptedUser.password)) {
          resolve("Congrats!")
        } else {
          reject("invalid username/password")
        }
      })
      .catch(function () {
        reject("Please try again later.")
      })
  })
}

// this register function is set up to return a promise.
// this promise is leveraged in user controller
User.prototype.register = function () {
  return new Promise(async (resolve, reject) => {
    // Step #1: Clean Up and Validate our user data
    this.cleanUp()
    // validate function returns a promise so can now use await
    // this means function above needs to be async
    await this.validate()
    // Step #2: Only if there are no validation errors
    // then save the user data into the database
    if (!this.errors.length) {
      //hash user password
      let salt = bcrypt.genSaltSync(10)
      this.data.password = bcrypt.hashSync(this.data.password, salt)

      // insert into db
      await usersCollection.insertOne(this.data)
      resolve()
    } else {
      reject(this.errors)
    }
  })
}

//required for a couple of actions including frontend-js registrationForm validation
User.findByUsername = function (username) {
  return new Promise(function (resolve, reject) {
    if (typeof username != "string") {
      reject()
      //prevent further execution of the function
      return
    }

    usersCollection
      .findOne({ username: username })
      .then(function (userDoc) {
        if (userDoc) {
          // was userDoc = new User(userDoc, true)
          // removed ture as param since currently not utilizing avatar
          userDoc = new User(userDoc)
          // customizing userDoc to only gte what we need and not show hashed password
          userDoc = {
            // have _id so we can later look up posts by this user
            _id: userDoc.data._id,
            username: userDoc.data.username
            // avatar: userDoc.avatar
          }
          resolve(userDoc)
        } else {
          reject()
        }
      })
      .catch(function () {
        reject()
      })
  })
}

User.doesEmailExist = function (email) {
  return new Promise(async function (resolve, reject) {
    if (typeof email != "string") {
      resolve(false)
      //stop any further execution of function if not a string
      return
    }

    //check database
    let user = await usersCollection.findOne({ email: email })
    if (user) {
      resolve(true)
    } else {
      resolve(false)
    }
  })
}

module.exports = User
