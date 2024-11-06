const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const validatePreferences = require("../utilities/handlePreferences");
const addCurrentProducts = require("../utilities/handleCurrentData");
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;

router.post("/newProducts", (req, res, next) => {
  // ADDING PREFERENCES TO DATABASE
  validatePreferences(req.body.productName);

  axios
    .get(
      `${baseAPI}&q=%22${formateProductName(
        req.body.productName
      )}%22&api_key=${serpapiKey}`
    )
    .then((respond) => {
      // CREATE CURRENT PRODUCTS
      const searchProduct = {
        id: req.body.productListsId,
        name: req.body.productName,
        productLists: respond.data.shopping_results,
      };

      addCurrentProducts(searchProduct);
      res.status(200).json({ status: "Search completed" });
    })
    .catch((error) => {
      res.status(500).json("Internal Server Error");
    });
});
module.exports = router;
