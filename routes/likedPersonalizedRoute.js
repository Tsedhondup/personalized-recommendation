const router = require("express").Router();
const likedPersonalized = require("../controllers/likedPersonalized");
router
  .route("/")
  .get(likedPersonalized.getLikedPersonalized)
  .post(likedPersonalized.addLikedPersonalized);
module.exports = router;
