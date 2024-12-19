const router = require("express").Router();
const newProduct = require("../controllers/searchNewProduct");
router.route("/").get(newProduct.checkSimilarSearch);

module.exports = router;
