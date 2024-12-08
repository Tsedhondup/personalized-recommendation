const router = require("express").Router();
const currentSearchPersonalized = require("../controllers/currentSearchPersonalized");
router
  .route("/")
  .get(currentSearchPersonalized.getCurrentSearchPersonalized);
module.exports = router;
