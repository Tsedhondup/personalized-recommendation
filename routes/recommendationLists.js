const express = require("express");
const router = express.Router();
const axios = require("axios");
const fs = require("fs");
const sortForMoreThanThree = require("../utilities/sortForMoreThanThree");
const sortForThreeOrLess = require("../utilities/sortForThreeOrLess");

router.get("/recommendations", (req, res, nexst) => {
  // GET ALL THE PREFERENCE DATA
  fs.readFile("data/preferences.json", (err, data) => {
    if (err) {
      console.log(err);
      res.status(500).json({ message: "network error" });
    }
    const parsedData = JSON.parse(data); // parsed data
    // CHECK TOTAL LENGTH OF PREFERENCE DATA
    if (parsedData.length > 0) {
      const totalData = parsedData.length;
      if (totalData <= 3) {
        // IF THRE ARE THREE OR LESS, SEND PRODUCT RECOMMENDATIONS OF ALL THREE IN DESCENDING IN ORDER
        sortForThreeOrLess(res, parsedData);
      } else {
        /*
        IF THERE MORE THAN THREE PRODUCTS, 
        THEN SEND THE PRODUCT RECOMMENDATIONS OF HIGHEST SCORED PRODUCTS IN DESCENDING ORDER
        */
        sortForMoreThanThree(res, parsedData);
      }
    }
  });
});
module.exports = router;
