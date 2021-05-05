const bcrypt = require("bcryptjs")
// using Object ID
const ObjectId = require('mongodb').ObjectId
// when configuring storing sessions into db had to add .db() before collection
const usersCollection = require("../db").db().collection("users")
// Bring in items collection for when settings are updated want to change existing items
const itemsCollection = require("../db").db().collection("items")
// helps validate user registration form
const validator = require("validator")

let User = function (data) {
  this.data = data
  this.errors = []
  this.useful_miles = 150000,
  this.monthly_miles = 1250
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
    password: this.data.password,
    useful_miles: this.useful_miles,
    monthly_miles: this.monthly_miles
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
    if (this.data.password.length > 0 && this.data.password.length < 6) {
      this.errors.push("Password must be at least 6 characters.")
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
          this.data = attemptedUser
         /*  this.getAvatar() */
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
      /* this.getAvatar() */
      resolve()
    } else {
      reject(this.errors)
    }
  })
}


// required for a couple of actions including frontend-js registrationForm validation
// also going to try and use for settings screen
User.findByUsername = function (username) {
  return new Promise(function (resolve, reject) {
    if (typeof(username) != "string") {
      reject()
      //prevent further execution of the function
      return
    }

    usersCollection
      .findOne({ username: username })
      .then(function (userDoc) {
        if (userDoc) {
          userDoc = new User(userDoc)
          // customizing userDoc to only get what we need and not show hashed password
          userDoc = {
            // have _id so we can later look up items by this user
            _id: userDoc.data._id,
            username: userDoc.data.username,
            useful_miles: userDoc.data.useful_miles,
            monthly_miles: userDoc.data.monthly_miles,
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


// Updating User Settings
User.prototype.update = function(requestedUsername, visitorUsername, visitorId) {
  //console.log("update function ran and requested username parameter came in as " + requestedUsername)
  return new Promise(async (resolve, reject) => {
      try {
          // console.log("Try Block in Update Function Ran")
          let user = await User.findByUsername(requestedUsername)
          if (requestedUsername == visitorUsername) {
              // console.log to ensure receiving session id
              console.log(visitorId)
              // actually update db
              let status = await this.actuallyUpdate(requestedUsername, visitorId)
              resolve(status) 
          } else {
              reject()
          } // closes try
      } catch {
          reject()
      } // closes catch
  }) // closes promise
} // closes update

User.prototype.cleanAndValidateSettings = function() {
  //console.log("cleanAndValidateSettings Function Ran")
  
  // if user input is not a string set it to empty string
  
  //console.log("TypeOf for useful miles is " + typeof(this.data.useful_miles))
  if (typeof this.data.useful_miles != "string") {
    this.data.useful_miles = ""
  }

  //console.log("TypeOf for useful miles is " + typeof(this.data.monthly_miles))
  if (typeof this.data.useful_miles != "string") {
    this.data.useful_miles = ""
  }
  
  // convert user input to a number
  this.data.useful_miles = parseInt(this.data.useful_miles)
  this.data.monthly_miles = parseInt(this.data.monthly_miles)
  //console.log("TypeOf for useful miles is " + typeof(this.data.useful_miles))
  //console.log("TypeOf for useful miles is " + typeof(this.data.monthly_miles))

  // if user input is not a number use hard-coded default values
  if (isNaN(this.data.useful_miles)) {
    this.data.useful_miles = 150000
  }

  if (isNaN(this.data.monthly_miles)) {
    this.data.monthly_miles = 1250
  }

  if (this.data.useful_miles == "") {
    this.data.useful_miles = 150000
  }
  if (this.data.useful_miles < 100) {
    this.errors.push("You must provide a value greater than 100.")
  }
  if (this.data.useful_miles > 1000000) {
    this.errors.push("You must provide a value less than 1000000.")
  }

  if (this.data.monthly_miles == "") {
    this.data.monthly_miles = 1250
  }
  if (this.data.monthly_miles < 1) {
    this.errors.push("You must provide a value greater than 1.")
  }
  if (this.data.monthly_miles > 10000) {
    this.errors.push("You must provide a value less than 10000.")
  }
  
} // Closes Function


// Updating User Settings in Database After Passing Validation Checks
User.prototype.actuallyUpdate = function(requestedUsername, visitorId) {
  // console.log("actuallyUpdate function actuallyRan")
  return new Promise(async (resolve, reject) => {
    this.cleanAndValidateSettings()  
    if (!this.errors.length) {
        // this.username, this._id, req.session.user._id, logged in console as undefined
        // remember there is no request data in model files
        await usersCollection.findOneAndUpdate({username: requestedUsername}, {$set: {useful_miles: this.data.useful_miles, monthly_miles: this.data.monthly_miles }})
        // after udpating the user props update the existing items for that author
        await itemsCollection.aggregate([
          {$match: {author: new ObjectId(visitorId) }},
          {$lookup: {from: "users", localField: "author", foreignField: "_id", as:"ownerSettings"}},
          {$project: {
            _id: 1,
            description: 1,
            cost: 1,
            miles: 1,
            remaining_months: 1,
            cost_per_remaining_month: 1,
            link: 1,
            createdDate: 1,
            author: 1,
            owner: {$arrayElemAt: ["$ownerSettings", 0]}
          }}
        ]).forEach((x) => {

          let updatedRemMos = Math.round((x.owner.useful_miles - x.miles) / x.owner.monthly_miles)
          let costPerRemMos = Math.round(x.cost / ((x.owner.useful_miles - x.miles) / x.owner.monthly_miles))

          itemsCollection.updateOne(
            { _id: x._id },
            {$set: {"remaining_months": updatedRemMos, "cost_per_remaining_month": costPerRemMos}}
          )
        }) // closes forEach
        resolve("success")
    } else {resolve("failure")}
   
  }) // closes Promise
} // closes Actually Update


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
