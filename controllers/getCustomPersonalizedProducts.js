const knex = require("knex")(require("../knexfile"));
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const axios = require("axios");

const getCustomPersonalized = (req, res) => {
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
      res.status(200).json({ status: "SEARCH COMPLETED" });
    })
    .catch((error) => {
      res.status(500).json("Internal Server Error");
    });
};

const getCustomPreferences = (req, res) => {
  knex("products")
    .where("user_id", req.body.userId)
    .select("name")
    .then((data) => {
      res.status(200).json(data);
    })

    .catch((error) => {
      console.log(error);
    });
};
module.exports = {
  getCustomPreferences,
};
