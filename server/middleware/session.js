function loggedIn(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.status(401)
    }
}

exports.loggedIn = loggedIn
