const knex = require("knex")(require("../knexfile"));
const axios = require("axios");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const formateProductName = require("../utilities/formateProductName");

// ADDING SEARCHED PRODUCTS TO PERSONALIZED JSON FILE
const addCurrentData = async (req, currentData) => {
  const searchId = uuid();
  const userFilePath = `data/currentSearchData/${req.query.sessionId}.json`;
  if (fs.existsSync(userFilePath)) {
    fs.readFile(
      `data/currentSearchData/${req.query.sessionId}.json`,
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
            searchOrigin: req.query.currentSearch,
            searchId: searchId,
            searchData: currentData.map((product) => product),
          };
          // ADDING NEW PERSONALIZED DATA TO NEW ARRAY CONTAINING ALL PERSONALIZED DATA
          const newPersonalizedData = [...parsedData, newPersonalizedItem];
          fs.writeFile(
            `data/currentSearchData/${req.query.sessionId}.json`,
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
      searchOrigin: req.query.currentSearch,
      searchId: searchId,
      searchData: currentData.map((product) => product),
    };
    // CREATING PERSONALIZED DATA FOR THE FIRST TIME
    fs.writeFile(
      `data/currentSearchData/${req.query.sessionId}.json`,
      JSON.stringify([newPersonalizedItem]),
      (error) => {
        console.log(error);
      }
    );
  }
  return searchId; // this id will be send to client as repond
};
// GET SEARCH RESULT FROM SERPAPI API RESPOND AND ARE MODIFIED
const modifiedSearchedResult = (req, searchedResult) => {
  // MODIFY SHOPPING_RESULTS
  if (searchedResult.data.shopping_results) {
    const data = searchedResult.data.shopping_results.map((product) => {
      return {
        id: uuid(),
        searchOrigin: req.query.currentSearch,
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
        searchOrigin: req.query.currentSearch,
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
      `${req.query.currentSearch} accessories`
    )}%22&api_key=${serpapiKey}`
  );

  const modifiedSearchedData = modifiedSearchedResult(req, searchResult);
  // ADD PERSONALIZED DATA TO USER TEMPORARY JSON FILE
  let currentProductSearchId; // holds unique id of current search product that will be used for reading current data from JSON file
  if (modifiedSearchedData.length > 0) {
    currentProductSearchId = await addCurrentData(req, modifiedSearchedData); // add current search data to json file and returns id of current search data object
  }
  // ADD CURRENT SEARCHED PRODUCT NAME TO DATA BASE
  await knex("current_searches").insert({
    searchName: req.query.searchName,
    userId: req.query.userId,
  });
  // SEDING RESPOND
  modifiedSearchedData.length > 0
    ? res.status(200).json({ itemId: currentProductSearchId })
    : res.status(200).json({
        // new function will be created to further handle this task
        message: "something went wrong",
      });
};
module.exports = { searchNewProduct };
