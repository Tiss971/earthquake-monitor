var express = require("express");
var router = express.Router();

var earthquake = require("../controllers/rest/earthquake");

router.get("/latest/:time/:magnitude", earthquake.get_earthquakes);

module.exports = router;