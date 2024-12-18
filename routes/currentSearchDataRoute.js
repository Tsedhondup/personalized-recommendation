const router = require("express").Router();
const getCurrentSearchData = require("../controllers/currentSearchData");
router.route("/").get(getCurrentSearchData.getCurrentSearchData);
module.exports = router;
