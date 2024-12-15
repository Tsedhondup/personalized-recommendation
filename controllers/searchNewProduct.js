const knex = require("knex")(require("../knexfile"));
const axios = require("axios");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const formateProductName = require("../utilities/formateProductName");

// ADDING SEARCHED PRODUCTS TO PERSONALIZED JSON FILE
const addCurrentData = async (req, currentData) => {
  const userFilePath = `data/currentSearchData/${req.body.sessionId}.json`;
  if (fs.existsSync(userFilePath)) {
    fs.readFile(
      `data/currentSearchData/${req.body.sessionId}.json`,
      (error, data) => {
        if (error) {
          console.log(
            "function name: addSearchDataToPersonalizedFile during fs.readFile"
          );
          console.log(error);
        }
        // PARSED EXISITING PERSONALIZED DATA
        const parsedData = JSON.parse(data);
        // CHECK IF DATABASE CONTAINS PREFERENCE DATA
        if (parsedData.length > 0) {
          // CREATE NEW PERSONALISED DATA FOR NEW SEARCH ORIGIN
          const newPersonalizedItem = {
            searchOrigin: req.body.currentSearch,
            searchId: uuid(),
            data: currentData.map((product) => product),
          };
          // ADDING NEW PERSONALIZED DATA TO NEW ARRAY CONTAINING ALL PERSONALIZED DATA
          const newPersonalizedData = [...parsedData, newPersonalizedItem];
          fs.writeFile(
            `data/currentSearchData/${req.body.sessionId}.json`,
            JSON.stringify(newPersonalizedData),
            (error) => {
              console.log(
                "function name: addSearchDataToPersonalizedFile during fs.writeFile"
              );
              console.log(error);
            }
          );
        } else {
        }
      }
    );
  } else {
    // CREATE NEW PERSONALISED DATA FOR NEW SEARCH ORIGIN
    const newPersonalizedItem = {
      searchOrigin: req.body.currentSearch,
      searchId: uuid(),
      data: currentData.map((product) => product),
    };
    // CREATING PERSONALIZED DATA FOR THE FIRST TIME
    fs.writeFile(
      `data/currentSearchData/${req.body.sessionId}.json`,
      JSON.stringify([newPersonalizedItem]),
      (error) => {
        console.log(error);
      }
    );
  }
};
// GET SEARCH RESULT FROM SERPAPI API RESPOND AND ARE MODIFIED
const modifiedSearchedResult = (req, searchedResult) => {
  // MODIFY SHOPPING_RESULTS
  if (searchedResult.data.shopping_results) {
    const data = searchedResult.data.shopping_results.map((product) => {
      return {
        id: uuid(),
        searchOrigin: req.body.currentSearch,
        title: product.title,
        link: product.product_link,
        source: product.source,
        source_logo: product.source_icon,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.thumbnail,
      };
    });
    return data;
  }
  //MODIFIED IMMERSIVE_PRODUCTS
  if (searchedResult.immersive_products) {
    const data = searchedResult.immersive_products.map((product) => {
      /*
       * product link is currently not available in immersive_products objects
       * use source name and direct user to source website when click on buy button
       */
      return {
        id: uuid(),
        searchOrigin: req.body.currentSearch,
        title: product.title,
        source: product.source,
        source_logo: product.source_icon,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        image: product.thumbnail,
      };
    });
    return data;
  }
};
const searchNewProduct = async (req, res) => {
  const searchResult = await axios.get(
    `${baseAPI}&q=%22${formateProductName(
      `${req.body.productName} accessories`
    )}%22&api_key=${serpapiKey}`
  );

  const modifiedSearchedData = modifiedSearchedResult(req, searchResult);
  // ADD PERSONALIZED DATA TO USER TEMPORARY JSON FILE
  if (modifiedSearchedData.length > 0) {
    addCurrentData(req, modifiedSearchedData);
  }
  // SEDING RESPOND
  modifiedSearchedData.length > 0
    ? res.status(200).json(modifiedSearchedData)
    : res.status(200).json({
        // new function will be created to further handle this task
        message: "something went wrong",
      });
};
module.exports = { searchNewProduct };
