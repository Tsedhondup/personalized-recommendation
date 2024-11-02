const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const validatePreferences = require("../utilities/handlePreferences");
const addCurrentProducts = require("../utilities/handleCurrentData");
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;

router.get("/products", (req, res, next) => {
  // ADDING PREFERENCES TO DATABASE
  validatePreferences(req.query.productName);

  axios
    .get(
      `${baseAPI}&q=%22${formateProductName(
        req.query.productName
      )}%22&api_key=${serpapiKey}`
    )
    .then((respond) => {
      addCurrentProducts(respond.data.shopping_results);
      res.status(200).json(respond.data.shopping_results);
    })
    .catch((error) => {
      res.status(500).json("Internal Server Error");
    });
});
module.exports = router;
