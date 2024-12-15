const router = require("express").Router();
const historyPersonalized = require("../controllers/historyPersonalized");
router
  .route("/")
  .get(historyPersonalized.getHistoryPersonalized)
  .post(historyPersonalized.addHistoryPersonalized)
  .delete(historyPersonalized.deleteHistoryPersonalized);
module.exports = router;
