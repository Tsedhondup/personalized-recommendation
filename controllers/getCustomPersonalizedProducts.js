const knex = require("knex")(require("../knexfile"));
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const axios = require("axios");

const getSources = async (req, res, productLists) => {
  try {
    const productArray = productLists.map(async (product) => {
      // getting all the sources asynchronously
      const sources = await knex("sources").where("product_id", product.id); // return all sources
      // return object
      return {
        id: product.id,
        productName: product.name,
        preferenceScore: product.preference_score,
        sources: sources.map((element) => ({
          id: element.id,
          name: element.name,
          score: element.source_score,
          product_id: element.product_id,
        })),
      };
    });
    // Wait for all queries to complete
    const products = await Promise.all(productArray); // const products = productsArray
    res.status(200).json(products);
  } catch (error) {
    console.error("Error fetching product data:", error);
  }
};

const getCustomPreferences = (req, res) => {
  knex("products")
    .where("user_id", req.body.userId)
    .then((productLists) => {
      getSources(req, res, productLists);
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = {
  getCustomPreferences,
};
