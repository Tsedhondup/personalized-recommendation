const router = require("express").Router();
const getMainPersonalized = require("../controllers/getMainPersonalized");
router
  .route("/getMainPersonalized")
  .get(getMainPersonalized.getMainPersonalized);
module.exports = router;
