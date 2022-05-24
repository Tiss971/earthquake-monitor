var express = require("express");
var router = express.Router();
var session = require("../middleware/session");

var earthquake = require("../controllers/rest/earthquake");

router.get("/latest/:time/:magnitude", earthquake.get_earthquakes);
router.get("/number/:range/:magnitude", earthquake.count_earthquakes);
router.get("/nearestUsers/:latitude/:longitude", session.loggedIn, earthquake.get_nearest_users);
module.exports = router;