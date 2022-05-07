//Connect to Mongo database
const mongoose = require("mongoose")
mongoose.Promise = global.Promise

// Connect to the database before starting the application server.
const uri = process.env.DB_URI

mongoose.connect(uri).then(
    () => {
        console.log("Connected to Mongo")
    },
    (err) => {
        console.log("error connecting to Mongo: ")
        console.log(err)
    }
)
module.exports = mongoose.connection
