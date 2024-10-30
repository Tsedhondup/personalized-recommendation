const express = require("express");
const router = express.Router();
const axios = require("axios");
const { validate } = require("uuid");
const validatePreferences = require("../utilities/handlePreferences");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
router.get("/recommendation", (req, res, nexst) => {
  // GET REQUEST
  // axios
  //   .get(`${baseAPI}&q=%22${req.query.productName}%22&api_key=${serpapiKey}`)
  //   .then((respond) => {
  //     res.status(200).json(respond.data.shopping_results);
  //   })
  //   .catch((error) => {
  //     res.status(500).json("Internal Server Error");
  //   });
  validatePreferences("IPHONE");
  res.status(200).json({ message: " ok" });
});
module.exports = router;
