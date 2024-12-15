const router = require("express").Router();
const likedPersonalized = require("../controllers/likedPersonalized");
router
  .route("/")
  .get(likedPersonalized.getLikedPersonalized)
  .post(likedPersonalized.addLikedPersonalized)
  .delete(likedPersonalized.deleteLikedPersonalized);
module.exports = router;
