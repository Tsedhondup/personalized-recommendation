const knex = require("knex")(require("../knexfile"));
const axios = require("axios");
const fs = require("fs");
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const { v4: uuid } = require("uuid");

// GET SEARCH RESULT FROM SERPAPI API RESPOND AND ARE MODIFIED
const filterSearchedResult = (searchedResult) => {
  // MODIFY SHOPPING_RESULTS
  if (searchedResult.data.shopping_results) {
    return {
      data: searchedResult.data.shopping_results.map((product) => {
        return {
          id: uuid(),
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
          id: uuid(),
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

// TEMPORARILY SAVING MAIN PERSONALIZED PRODUCTS IN JSON FILE
const savedFetchedData = (req, fetchedData) => {
  fs.writeFile(
    `data/mainPersonalizedData/${req.body.sessionId}.json`,
    JSON.stringify(fetchedData),
    (error) => {
      console.log(error);
    }
  );
};
// MAKE FRESH API REQUEST TO GET DATA FOR ALL SELECTED PRODUCTS
const fetchProducts = async (req, res, allProductsWithSources) => {
  // COUNTER VARIABLE FOR TOTAL API REQUEST - TOTAL OF 4 API REQUEST ARE BEING AT THE MOMENT = TOTAL OF 4 PRODUCTS
  let counterVal = 0;
  // MAKING SERPAPI API REQUEST
  const fetchedData = await Promise.all(
    allProductsWithSources.map(async (product) => {
      const sourceName = product.sources ? product.sources[0]?.name : "";
      if (counterVal < 4) {
        const searchedData = await axios.get(
          `${baseAPI}&q=%22${formateProductName(
            `${sourceName} ${product.productName} `
          )}%22&api_key=${serpapiKey}`
        );
        return {
          productName: product.productName,
          data: searchedData,
        };
      }
      counterVal = counterVal + 1; // increment by +1
    })
  );
  // FILTER FETCHED DATA
  const filteredFetchedData = fetchedData.map((searchedData) => {
    return {
      productName: searchedData.productName,
      productData: filterSearchedResult(searchedData.data),
    };
  });
  // RESTRUCTURE FILTERED FETCHED DATA
  const restructureFilteredFetchedData = filteredFetchedData.map(
    (fetchedDataLists) => {
      return {
        productName: fetchedDataLists.productName,
        parentId: uuid(),
        productData: fetchedDataLists.productData.data,
      };
    }
  );

  // ADD TO MAIN-PERSONALIZED-DATA FOLDER
  savedFetchedData(req, restructureFilteredFetchedData);
  // SEND RESPOND DATA
  res.status(200).json(restructureFilteredFetchedData);
};
const getMainPersonalized = async (req, res) => {
  const allProducts = await knex("products").where("user_id", req.body.userId);
  const sortedProducts = allProducts.sort(
    (a, b) => a.preference_score - b.preference_score
  );

  // FETCHING SOURCES FOR ALL PRODUCTS
  const allProductsWithSources = await Promise.all(
    sortedProducts.map(async (product) => {
      const sources = await knex("sources")
        .where("product_id", product.id)
        .orderBy("source_score", "desc") // order sources in descending order of source_scores
        .first(); // pick the first source which is the heighest score
      return {
        productId: product.id,
        productName: product.name,
        preferenceScore: product.preference_score,
        sources: sources,
      };
    })
  );
  fetchProducts(req, res, allProductsWithSources);
};
module.exports = { getMainPersonalized };