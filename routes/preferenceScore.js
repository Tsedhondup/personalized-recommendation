const express = require("express");
const router = express.Router();
const fs = require("fs");
const validatePreferences = require("../utilities/handlePreferences");

router.post("/preferences", (req, res, nexst) => {
  // ADDING PREFERENCES TO DATABASE
  validatePreferences(req.body.productName, req.body.userId);
  res.status(200).json({ message: "Product added to database" });
});
module.exports = router;
