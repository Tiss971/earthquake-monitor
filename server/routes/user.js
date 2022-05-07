var express = require("express");
var router = express.Router();
var users = require("../controllers/rest/user");
var auth = require("../middleware/auth")();
/* TEST */
router.get("/privateUsers", auth.authenticate(), users.all_users);
router.get("/publicUsers", users.all_users);
router.get("/:id", users.user_by_id);

router.get("/getAll", users.all_users);
router.get("/closest/:location", users.closest_user);


module.exports = router;