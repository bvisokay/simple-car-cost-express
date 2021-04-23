const itemsCollection = require("../db").db().collection("items")
const ObjectId = require('mongodb').ObjectId
const User = require("./User")

// Receiving incoming form data from user req.body
// Doing this with parameter called data and storing

let Item = function (data, userid) {
  this.data = data
  this.errors = []
  this.userid = userid
  this.useful_miles = 150000
  this.monthly_miles = 1250
}

Item.prototype.cleanUp = function () {
  // checkout what is in the data
  console.log(this.data)
  // the values must be strings
  if (typeof this.data.description != "string") {
    this.data.description = ""}
  if (typeof this.data.cost != "string") {
    this.data.cost = "1"}
  if (typeof this.data.miles != "string") {
    this.data.miles = "1"}
  if (typeof this.data.link != "string") {
    this.data.link = ""}

    // get rid of any bogus properties
    // .toFixed(2) not working on CPRM property
    this.data = {
      description: this.data.description.trim(),
      cost: parseInt(this.data.cost, 10),
      miles: parseInt(this.data.miles, 10),
      remaining_months: parseInt(((this.useful_miles - this.data.miles) / this.monthly_miles)),
      cost_per_remaining_month: this.data.cost / parseInt((this.useful_miles - this.data.miles) / this.monthly_miles),
      link: this.data.link.trim(),
      createdDate: new Date(),
      author: ObjectId(this.userid)
    }
}
Item.prototype.validate = function () {
  if (this.data.description == "") {
    this.errors.push("You must provide a description.")
  }
  if (this.data.cost == "") {
    this.errors.push("You must provide the cost.")
  }
  if (this.data.miles == "") {
    this.errors.push("You must provide the miles.")
  }
  // allowing the link to be empty
  if (this.data.link == "") {
    this.data.link = "No Link Provided"
  }
}
Item.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()
    // checkout typeOf for cost and miles properties
    console.log(
      "Cost is a " + (typeof(this.data.cost))
    + " and miles is a " + (typeof(this.data.miles))
    + " and remaining_months is a " + typeof(this.data.remaining_months)
    + " and cost_per_remaining_month is a " + typeof(this.data.cost_per_remaining_month))
    
    
    
    
    
    if (!this.errors.length) {
      // Save Car Item in DB
      itemsCollection
        .insertOne(this.data)
        .then(() => {
          resolve()
        })
        .catch(() => {
          this.errors.push("Please try again later")
          reject(this.errors)
           
        })
    } else {
      reject(this.errors)
    }
  })
}

Item.findSingleById = function(id) {
      return new Promise(async function(resolve, reject) {
      if (typeof(id) != "string" || !ObjectId.isValid(id)) {
        reject()
        return
      }
      // .toArray is needed to put in format we can use and return a promise
      let items = await itemsCollection.aggregate([
        {$match: {_id: new ObjectId(id)}},
        {$lookup: {from: "users", localField: "author", foreignField: "_id", as: "authorDocument"}},
        {$project: {
          description: 1,
          cost: 1,
          miles: 1,
          remaining_months: 1,
          cost_per_remaining_month: 1,
          link: 1,
          createdDate: 1,
          author: {$arrayElemAt: ["$authorDocument", 0]}
        }}
      ]).toArray()

      //clean up author preoporty in each item object
      items = items.map(function(item) {
        item.author = {
          username: item.author.username
          /* avatar: new User(post.author, true) */
        }
        return item
      })

      if (items.length) {
        console.log(items[0])
      resolve(items[0])
      //console.log(item)
      } else {
      reject()
      }
      })
 }

module.exports = Item
