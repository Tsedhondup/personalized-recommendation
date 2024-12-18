const router = require("express").Router();
const sendCurrentSearchData = require("../controllers/currentSearchData");
router.route("/").get(sendCurrentSearchData.sendCurrentSearchData);
module.exports = router;
