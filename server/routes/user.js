var express = require("express");
var router = express.Router();
var users = require("../controllers/rest/user");
var session = require("../middleware/session");
var auth = require("../middleware/auth")();
/* TEST */
router.get("/privateUsers", auth.authenticate(), users.all_users);
router.get("/publicUsers", users.all_users);


router.get("/getAll", users.all_users);
router.get("/:id", users.user_by_id);
router.get("/",session.loggedIn, users.getUserInSession);

router.put("/setLocation", users.set_location);
router.put("/setPublic", users.set_public);
module.exports = router;