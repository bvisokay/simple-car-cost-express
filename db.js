const dotenv = require("dotenv")
dotenv.config()
const mongodb = require("mongodb")

mongodb.connect(process.env.CONNECTIONSTRING, { useNewUrlParser: true, useUnifiedTopology: true }, function (err, client) {
  module.exports = client.db()
  // db is entry to app, after establishing connection then import the app
  const app = require("./app")
  // our server is listening on localhost:3000
  app.listen(process.env.PORT)
})
