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
    const parsedData = JSON.parse(data); // parsed data
    // CHECK TOTAL LENGTH OF PREFERENCE DATA
    if (parsedData.length > 0) {
      res.status(200).json({ parsedData });
    } else {
      res.status(200).json({ message: "no data" });
    }
  });
});
module.exports = router;
