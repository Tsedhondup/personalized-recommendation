const router = require("router").Route();
const savedPersonalized = require("../controllers/savedPersonalized");
router.route("/").get(savedPersonalized.getSavedPersonalized);
