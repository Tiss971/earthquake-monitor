const express = require("express")
const router = express.Router()
const axios = require("axios")

const User = require("../database/models/user")
var auth = require("../middleware/auth")()
const passport = require("../passport")

const bcrypt = require("bcryptjs")
jwt = require("jwt-simple")
function recaptcha_token_verify(req,res,next){
    const token = req.body.token
    const secret = process.env.RECAPTCHA_SECRET_KEY

    axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${secret}&response=${token}`)
    .then(response => {
        console.log(response.data)
        if(response.data.success){
            next()
        }else{
            res.status(401).send("Recaptcha Failed")
        }
    })
}
/* Local Register */
router.post("/register",recaptcha_token_verify,(req, res) => {
    
    const { username, email, password } = req.body
    // CHECK IF USERNAME EXIST
    User.findOne({ username: username }, (err, user) => {
        if (err) {
            console.log("Error : ", err)
        } else if (user) {
            res.json({
                ok: false,
                message: "This username is already taken",
            })
        } else {
            // CHECK IF EMAIL EXIST
            User.findOne({ email: email }, (err, user) => {
                if (err) {
                    console.log("Error : ", err)
                } else if (user) {
                    res.json({
                        ok: false,
                        message: "This email is already registered",
                    })
                } else {
                    // CREATE USER
                    const newUser = new User({
                        username: username,
                        email: email,
                        password: password,
                    })
                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if (err) throw err
                            newUser.password = hash
                            newUser.save((err, savedUser) => {
                                if (err) {
                                    console.log(err)
                                    res.statusCode = "401"
                                    return res.json(err)
                                } else {
                                    res.json({
                                        ok: true,
                                        message: `Welcome to the application, ${savedUser.username}!`,
                                    })
                                }
                            })
                        })
                    })
                }
            })
        }
    })
})
/* local login */
router.post("/login", function (req, res, next) {
    passport.authenticate("local", function (err, user, message) {
        if (err) {
            return next(err)
        }
        if (!user) {
            return res.status(401).json({
                ok: false,
                message: message,
            })
        }
        req.logIn(user, function (err) {
            if (err) {
                return next(err)
            }
            var payload = {
                id: req.user.id,
                expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
            }
            res.json({
                ok: true,
                user: req.user,
                token: jwt.encode(payload, process.env.TOKEN_SECRET),
            })
        })
    })(req, res, next)
})

/* Verify token */
router.get("/verifyJWT", auth.authenticate(), (req, res, next) => {
    res.json({
        ok: true,
        message: "JWT is valid",
    })
})

/* Google OAuth 2.0*/
router.get("/google/failure", (req, res) => {
    res.status(401).json({
        ok: false,
        message: "Google login failed",
    })
})
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
)
router.get(
    "/google/callback",
    passport.authenticate("google", {
        successRedirect: process.env.CLIENT_HOME,
        failureRedirect: "/auth/google/failure",
    })
)

/* Facebook */
router.get("/facebook/failure", (req, res) => {
    res.status(401).json({
        ok: false,
        message: "Facebook login failed",
    })
})
router.get("/facebook", passport.authenticate("facebook"))
router.get(
    "/facebook/callback",
    passport.authenticate("facebook", {
        scope: "email",
        failureRedirect: "/login",
        failureMessage: true,
    }),
    (req, res) => {
        res.redirect(process.env.CLIENT_HOME)
    }
)

/* Get user info */
router.get("/success", (req, res) => {
    if (req.user) {
        var payload = {
            id: req.user.id,
            expire: Date.now() + 1000 * 60 * 60 * 24 * 7, //7 days
        }
        res.json({
            ok: true,
            user: req.user,
            token: jwt.encode(payload, process.env.TOKEN_SECRET),
        })
    } else {
        res.status(401).json({
            ok: false,
            message: "Google login failed",
        })
    }
})

/* Logout */
router.get("/logout", (req, res) => {
    req.logout()
    res.status(200).clearCookie("connect.sid", {
        path: "/",
    })
    req.session.destroy(function (err) {
        res.send({
            ok: true,
            message: "Logging out",
        })
    })
})

module.exports = router
