const router = require("express").Router();
const addUser = require("../controllers/users");

router.route("/addUser").post(addUser.addUser);
module.exports = router;
