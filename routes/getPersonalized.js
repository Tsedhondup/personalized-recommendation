const router = require("express").Router();
const getCustomPreferences = require("../controllers/getCustomPersonalizedProducts");
router.route("/getPersonalized").get(getCustomPreferences.getCustomPreferences);
module.exports = router;
