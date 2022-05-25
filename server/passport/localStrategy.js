const LocalStrategy = require("passport-local").Strategy
const User = require("../database/models/user")
const bcrypt = require("bcryptjs")

const strategy = new LocalStrategy(
    {
        usernameField: "username",
    },
    function (username, password, done) {
        User.findOneAndUpdate(
            { $or: [{ email: username }, { username: username }] },
            { lastVisit: Date.now() },
            (err, user) => {
                if (err) {
                    return done(err)
                }
                if (!user) {
                    return done(null, false, "User not found")
                }
                console.log("User found")
                if (user.third_party_auth[0] === undefined) {
                    bcrypt.compare(password, user.password, (err, isMatch) => {
                        if (err) {
                            return done(err)
                        }
                        if (!isMatch) {
                            return done(null, false, "Incorrect Password")
                        }
                        console.log("Return user")
                        user.lastVisit = Date.now()
                        return done(null, user)
                    })
                } else {
                    return done(
                        null,
                        false,
                        "This email seems to be linked to a " +
                            user.third_party_auth[0].provider_name +
                            " account ! \
                        Please use the " +
                            user.third_party_auth[0].provider_name +
                            " login instead."
                    )
                }
            }
        )
    }
)

module.exports = strategy
