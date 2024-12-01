const router = require("express").Router();
const addUser = require("../controllers/addUsers");

router.route("/addUser").post(addUser.addUser);
module.exports = router;
