var User = require("../../database/models/user")

function all_users(req, res) {
    User.find({}, function (err, user) {
        if (err)
            return res.status(500).send("There was a problem finding the users.")
        res.status(200).send(user)
    })
}

function get_user_by_id(req, res) {
    User.findById(req.params.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.")
        if (!user) return res.status(404).send("No user found.")
        res.status(200).send(user)
    })
}

function update_user_by_id (req, res) {
    //check if username or email is already taken
    User.findOne({ username: req.body.user.username }, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.");
        if (user) {
            if (user._id.toString() !== req.body.id) {
                console.log("already exists")
                return res.status(409).send("Username already exists.");
            }
        }
        User.findOne({ email: req.body.user.email }, function (err, user) {
            if (err) return res.status(500).send("There was a problem finding the user.");
            if (user) {
                if (user._id.toString() !== req.body.id) {
                    console.log("already exists")
                    return res.status(409).send("Email already exists.");
                }
            }
            User.findOneAndUpdate({_id : req.body.user._id}, 
                {"username":req.body.user.username, "email":req.body.user.email},
                function (err, user) {
                if (err) return res.status(500).send("There was a problem updating the user.");
                return res.status(200).send({ok:true})
            })
        });
    });
}


function set_location(req, res) {
    User.findById(req.user.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.")
        if (!user) return res.status(404).send("No user found.")
        user.location = { type: "Point", coordinates: req.body.location }
        user.address = req.body.address
        user.save(function (err, user) {
            if (err)
                return res.status(500).send("There was a problem updating the user.")
            res.status(200).send(user)
        })
    })
}

function set_public(req, res) {
    User.findById(req.user.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.")
        if (!user) return res.status(404).send("No user found.")
        user.public = req.body.public
        user.save(function (err, user) {
            if (err)
                return res.status(500).send("There was a problem updating the user.")
            res.status(200).send(user)
        })
    })
}

function getUserInSession(req, res) {
    User.findById(req.user.id, function (err, user) {
        if (err) return res.status(500).send("There was a problem finding the user.")
        if (!user) return res.status(404).send("No user found.")
        res.status(200).send(user)
    })
}

exports.all_users = all_users
exports.get_user_by_id = get_user_by_id
exports.update_user_by_id = update_user_by_id
exports.set_location = set_location
exports.set_public = set_public
exports.getUserInSession = getUserInSession
