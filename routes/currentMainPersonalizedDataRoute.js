const router = require("express").Router();
const mainPersonalized = require("../controllers/mainPersonalized");
router.route("/").get(mainPersonalized.getAllCurrentMainPersonalized);
module.exports = router;
