const passport = require("passport")
const LocalStrategy = require("./localStrategy")
const GoogleStrategy = require("./googleStrategy.js")
const FacebookStrategy = require("./facebookStrategy.js")
const User = require("../database/models/user")

// called on login, saves the id to session req.session.passport.user = {id:'..'}
passport.serializeUser((user, done) => {
    console.log(user.username, "serialized") // the whole raw user object!
    done(null, { _id: user._id })
})

// user object attaches to the request as req.user
passport.deserializeUser((id, done) => {
    User.findOne({ _id: id }, "username image location", (err, user) => {
        if (err) {
            console.log("Error : ", err)
        } else {
            console.log(user.username, " deserialized")
            done(null, user)
        }
    })
})

//  Use Strategies
passport.use(LocalStrategy)
passport.use(GoogleStrategy)
passport.use(FacebookStrategy)

module.exports = passport
