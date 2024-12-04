const router = require("express").Router();
const getCurrentSearchPersonalized = require("../controllers/getCurrentSearchPersonalized");
router
  .route("/getCurrentSearchPersonalized")
  .get(getCurrentSearchPersonalized.getCurrentSearchPersonalized);
module.exports = router;
