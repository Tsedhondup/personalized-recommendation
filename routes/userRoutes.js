const router = require("express").Router();
const user = require("../controllers/users");

router.route("/").post(user.addUser).delete(user.removeUser);
module.exports = router;
