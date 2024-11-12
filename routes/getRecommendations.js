const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const fetchProductRecommendations = require("../utilities/fetchProductRecommendations");
const sortForThreeOrLess = require("../utilities/sortForThreeOrLess");

router.get("/getRecommendations", (req, res, next) => {
  // GET ALL THE PREFERENCE DATA
  fs.readFile("data/preferences.json", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "network error" });
    }
    const parsedData = JSON.parse(data); // parsed data
    // CHECK TOTAL LENGTH OF PREFERENCE DATA
    if (parsedData.length > 0) {
      const userPreferenceData = parsedData.find((element) => {
        return element.userId === req.query.userId;
      });

      // if (userPreferenceData <= 3) {
      //   // IF THRE ARE THREE OR LESS, SEND PRODUCT RECOMMENDATIONS OF ALL THREE IN DESCENDING IN ORDER
      //   sortForThreeOrLess(res, userPreferenceData.data);
      // } else {
      //   /*
      //   IF THERE MORE THAN THREE PRODUCTS,
      //   THEN SEND THE PRODUCT RECOMMENDATIONS OF HIGHEST SCORED PRODUCTS IN DESCENDING ORDER
      //   */
      //   sortForMoreThanThree(res, userPreferenceData.data);
      // }
    }
  });
});
module.exports = router;
