const itemsCollection = require("../db").db().collection("items")
const ObjectId = require("mongodb").ObjectId
/* const User = require("./User") */

// Receiving incoming form data from user req.body
// Doing this with parameter called data and storing

let Item = function (data, userId, usefulMiles, monthlyMiles, requestedItemId) {
  this.data = data
  this.errors = []
  this.userid = userId
  this.useful_miles = usefulMiles
  this.monthly_miles = monthlyMiles
  this.requestedItemId = requestedItemId
}

Item.prototype.cleanUp = function () {
  // checkout what is in the data
  // console.log(this.data)
  // the values must be strings
  if (typeof this.data.description != "string") {
    this.data.description = ""
  }
  if (typeof this.data.cost != "string") {
    this.data.cost = "1"
  }
  if (typeof this.data.miles != "string") {
    this.data.miles = "1"
  }
  if (typeof this.data.link != "string") {
    this.data.link = ""
  }
  // If user enters zero for cost or miles set it to one
  if (this.data.cost <= "0") {
    this.data.cost = "1"
  }
  if (this.data.miles <= "0") {
    this.data.miles = "1"
  }
  // If user enters absurdly high numbr for cost or miles set it to max
  // not working with data from sessions?
  /* if (this.data.cost > "500000") {
    this.data.cost = "500000"}
  if (this.data.miles > "500000") {
    this.data.miles = "500000"} */
  // if link doesn start with http or https then set to empty
  if (this.data.link.startsWith("http://") || this.data.link.startsWith("https://")) {
    console.log("Link Looks Good")
  } else {
    this.data.link = ""
  }

  // get rid of any bogus properties
  this.data = {
    description: this.data.description.trim(),
    cost: parseInt(this.data.cost, 10),
    miles: parseInt(this.data.miles, 10),
    remaining_months: Math.round(parseFloat((this.useful_miles - this.data.miles) / this.monthly_miles)),
    cost_per_remaining_month: parseFloat((parseFloat(this.data.cost, 10) / parseFloat((this.useful_miles - this.data.miles) / this.monthly_miles)).toFixed(0)),
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
  // link field allowed to be empty
}
Item.prototype.create = function () {
  return new Promise((resolve, reject) => {
    this.cleanUp()
    this.validate()

    if (!this.errors.length) {
      // Save Car Item in DB
      itemsCollection
        .insertOne(this.data)
        // passing info and resolving with info.ops[0]._id
        // needed if you want to navigate to url with post id right after creating
        .then(info => {
          resolve(info.ops[0]._id)
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

Item.prototype.update = function () {
  return new Promise(async (resolve, reject) => {
    try {
      let item = await Item.findSingleById(this.requestedItemId, this.userid)
      if (item.isVisitorOwner) {
        // actually update db
        let status = await this.actuallyUpdate()
        resolve(status)
      } else {
        reject()
      }
    } catch {
      reject()
    }
  })
}

Item.prototype.actuallyUpdate = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp()
    this.validate()
    if (!this.errors.length) {
      await itemsCollection.findOneAndUpdate({ _id: new ObjectId(this.requestedItemId) }, { $set: { description: this.data.description, cost: this.data.cost, miles: this.data.miles, remaining_months: this.data.remaining_months, cost_per_remaining_month: this.data.cost_per_remaining_month, link: this.data.link } })
      resolve("success")
    } else {
      resolve("failure")
    }
  })
}

//function created to avoid duplicate code in both findSingleById and findAuthorById
Item.reusablePostQuery = function (uniqueOperations, visitorId) {
  return new Promise(async function (resolve, reject) {
    let aggOperations = uniqueOperations.concat([
      { $lookup: { from: "users", localField: "author", foreignField: "_id", as: "authorDocument" } },
      {
        $project: {
          description: 1,
          cost: 1,
          miles: 1,
          remaining_months: 1,
          cost_per_remaining_month: 1,
          link: 1,
          createdDate: 1,
          authorId: "$author",
          author: { $arrayElemAt: ["$authorDocument", 0] }
        }
      }
    ])

    // .toArray is needed to put in format we can use and return a promise
    let items = await itemsCollection.aggregate(aggOperations).toArray()

    //clean up author property in each item object
    items = items.map(function (item) {
      // mongo method of equals returns value of true or false
      item.isVisitorOwner = item.authorId.equals(visitorId)

      item.author = {
        username: item.author.username
        /* avatar: new User(post.author, true) */
      }
      return item
    })
    resolve(items)
  })
}

// leverages reusablePostQuery function above to avoid duplicate code
// second param of visitorId is to receive incoming visitorId
Item.findSingleById = function (id, visitorId) {
  return new Promise(async function (resolve, reject) {
    if (typeof id != "string" || !ObjectId.isValid(id)) {
      reject()
      return
    }

    let items = await Item.reusablePostQuery([{ $match: { _id: new ObjectId(id) } }], visitorId)

    if (items.length) {
      // console.log(items[0])
      resolve(items[0])
      //console.log(item)
    } else {
      reject()
    }
  })
}

Item.findByAuthorId = function (authorId) {
  return Item.reusablePostQuery([{ $match: { author: authorId } }, { $sort: { createdDate: -1 } }])
}

Item.delete = function (itemIdToDelete, currentUserId) {
  return new Promise(async (resolve, reject) => {
    try {
      let item = await Item.findSingleById(itemIdToDelete, currentUserId)
      if (item.isVisitorOwner) {
        await itemsCollection.deleteOne({ _id: new ObjectId(itemIdToDelete) })
        resolve()
      } else {
        reject()
      }
    } catch {
      reject()
    }
  })
} // closes delete

module.exports = Item
