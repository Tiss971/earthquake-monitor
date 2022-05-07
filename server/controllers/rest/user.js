var User = require('../../database/models/user') 

function all_users (req, res) {
  User.find({}, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the users.");
    res.status(200).send(user);
  });
};

function closest_user (req, res) {
  res.send("closest user")
}

function user_by_id (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) return res.status(500).send("There was a problem finding the user.");
    if (!user) return res.status(404).send("No user found.");
    res.status(200).send(user);
  })
}

exports.all_users = all_users
exports.closest_user = closest_user
exports.user_by_id = user_by_id
