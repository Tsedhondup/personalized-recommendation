const router = require("express").Router();
const newProduct = require("../controllers/searchNewProduct");
router.route("/").get(newProduct.searchNewProduct);

module.exports = router;
