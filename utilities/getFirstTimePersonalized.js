const knex = require("knex")(require("../knexfile"));
const axios = require("axios");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const formateProductName = require("../utilities/formateProductName");

const getFirstTimePersonalized = async (_req, res, productLists) => {
  try {
    const productArray = productLists.map(async (product) => {
      const searchResult = await axios
        .get(
          `${baseAPI}&q=%22${formateProductName(
            product.productName
          )}%22&api_key=${serpapiKey}`
        )
        .then((result) => {
          return result.data.shopping_results;
        });
      return searchResult;
    });
    // Wait for all API calls to complete
    const products = await Promise.all(productArray);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json(error);
  }
};
module.exports = getFirstTimePersonalized;
