const express = require("express");
const router = express.Router();
const fs = require("fs");

router.get("/getCurrentProducts", (req, res, nexst) => {
  // GET ALL THE PREFERENCE DATA
  fs.readFile("data/currentProducts.json", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "network error" });
    }
    const currentData = JSON.parse(data); // parsed data

    // CREATE A COPY OF MATCHED CURRENT PRODUCT LISTS
    const requestedProductLists = currentData.filter((element) => {
      return element.id === req.query.productListsId.toString();
    });
    // CHECK TOTAL LENGTH OF PREFERENCE DATA
    if (requestedProductLists.length > 0) {
      res.status(200).json({ requestedProductLists });
    } else {
      res.status(200).json([]);
    }
  });
});
module.exports = router;
