const express = require("express");
const router = express.Router();
const axios = require("axios");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
router.get("/products", (req, res, nexst) => {
  // GET REQUEST
  axios
    .get(`${baseAPI}&q=%22${req.query.productName}%22&api_key=${serpapiKey}`)
    .then((respond) => {
      res.status(200).json(respond.data.shopping_results);
    })
    .catch((error) => {
      res.status(500).json("Internal Server Error");
    });
});
module.exports = router;
