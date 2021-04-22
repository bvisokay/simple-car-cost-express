const itemsCollection = require("../db").db().collection("items")
const ObjectId = require('mongodb').ObjectId

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
      if (typeof(id) != "string" || typeof(id) != "number" || !ObjectId.isValid(id)) {
        reject()
        return
      }
      let item = await itemsCollection.findOne({_id: new ObjectId(id)})
      if (item) {
      resolve(item)
      } else {
      reject()
      }
      })
 }

module.exports = Item
