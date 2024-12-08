const router = require("express").Router();
const savedPersonalized = require("../controllers/savedPersonalized");
router.route("/").get(savedPersonalized.getSavedPersonalized);
module.exports = router;
