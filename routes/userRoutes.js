const router = require("express").Router();
const addUser = require("../controllers/users");

router.route("/").post(addUser.addUser);
module.exports = router;
