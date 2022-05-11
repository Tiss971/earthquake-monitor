const User = require("../database/models/user")
const passport  = require ("../passport")
const passportJWT = require("passport-jwt")
const ExtractJwt = passportJWT.ExtractJwt
const JWTStrategy = passportJWT.Strategy
const params = {
    secretOrKey: process.env.TOKEN_SECRET,
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken("jwt"),
}

module.exports = function() {
    const jwtStrategy = new JWTStrategy(params, function (payload, done) {
        User.findById(payload.id, function (err, user) {
            if (err) {
                return done(new Error("UserNotFound"), null)
            } else if (payload.expire <= Date.now()) {
                return done(new Error("TokenExpired"), null)
            } else {
                return done(null, user)
            }
        })
    })
    passport.use(jwtStrategy);
    return {
        initialize: function() {
            return passport.initialize();
        },
        authenticate: function() {
            return passport.authenticate("jwt");
        }
    }
}