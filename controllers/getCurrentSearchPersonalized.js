const knex = require("knex")(require("../knexfile"));
const axios = require("axios");
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;

const getSearchedResult = (req, searchedResult) => {
  // MODIFY SHOPPING_RESULTS
  if (searchedResult.data.shopping_results) {
    return {
      data: searchedResult.data.shopping_results.map((product) => {
        return {
          searchOrigin: req.body.currentSearch,
          title: product.title,
          link: product.product_link,
          source: product.source,
          source_logo: product.source_icon,
          price: product.price,
          rating: product.rating,
          review: product.reviews,
          image: product.thumbnail,
        };
      }),
    };
  }
  //MODIFIED IMMERSIVE_PRODUCTS
  if (searchedResult.immersive_products) {
    return {
      data: searchedResult.immersive_products.map((product) => {
        /*
         * product link is currently not available in immersive_products objects
         * use source name and direct user to source website when click on buy button
         */
        return {
          searchOrigin: req.body.currentSearch,
          title: product.title,
          source: product.source,
          source_logo: product.source_icon,
          price: product.price,
          rating: product.rating,
          review: product.reviews,
          image: product.thumbnail,
        };
      }),
    };
  }
};
const newSearch = async (req, res) => {
  try {
    const searchResult = await axios.get(
      `${baseAPI}&q=%22${formateProductName(
        `${req.body.currentSearch} accessories`
      )}%22&api_key=${serpapiKey}`
    );

    // GET MODIFIED SEARCHED DATA
    const modifiedSearchedData = getSearchedResult(req, searchResult);
    modifiedSearchedData.data.length > 0
      ? res.status(200).json(modifiedSearchedData.data)
      : res.status(200).json({
          // new function will be created to further handle this task
          message: "send any back up recommendation data from saved file",
        });
  } catch (error) {
    res.status(500).json({ message: "something went wrong at newSearch" });
  }
};
const getSavedPersonalizedData = () => {};

const getCurrentSearchPersonalized = async (req, res) => {
  try {
    // get all search  history
    const lastSearchNames = await knex("current_searches").where(
      "user_id",
      req.body.userId
    );
    // check if current search is same as last search
    const hasLastSearch = lastSearchNames.some((searchName) => {
      return searchName.current_search === req.body.currentSearch;
    });
    // invoke conditional call-back functions
    hasLastSearch
      ? getSavedPersonalizedData(req, res, lastSearchNames)
      : newSearch(req, res);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong at getCurrentSearchPersonalized",
    });
  }
};
module.exports = { getCurrentSearchPersonalized };
