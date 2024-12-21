const knex = require("knex")(require("../knexfile"));
const axios = require("axios");
const fs = require("fs");
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;

// GETTING TEMPORARILY SAVED PERSONALIZED PRODUCTS AND SEND THEM TO CLIENT SITE
const getSavedPersonalized = (req, res) => {
  const userFilePath = `data/currentSearchPersonalizedData/${req.query.sessionId}.json`;
  if (fs.existsSync(userFilePath)) {
    fs.readFile(
      `data/personalizedData/${req.query.sessionId}.json`,
      (error, data) => {
        if (error) {
          console.log("function name: getSavedPersonalized");
          console.log(error);
          res.status(500).json({ message: "something went wrong" });
        }
        const personalizedData = JSON.parse(data);
        const currentSearchPersonalizedData = personalizedData.filter(
          (productLists) => {
            return productLists.searchOrigin === req.query.currentSearch;
          }
        );
        res.status(200).json(currentSearchPersonalizedData[0]);
      }
    );
  }
};
// UPDATE PREFERENCE SCORES OF SIMILAR SEARCHED PRODUCT NAME AND USER-ID - INVOKED IN getCurrentSearchPersonalized()
const updatePreferences = async (req, res, lastSearchNames) => {
  // UPDATE PREFERENCE SCORE OF CURRENT SEARCHED PRODUCT
  try {
    await knex("products")
      .where("name", req.query.currentSearch)
      .andWhere("user_id", req.query.userId)
      .then((product) => {
        const updatedPeferenceScore = product[0].preference_score + 2; // actively search product by user will have double increment
        return updatedPeferenceScore;
      })
      .then((updatedPeferenceScore) => {
        knex("products")
          .where("name", req.query.currentSearch)
          .andWhere("user_id", req.query.userId)
          .update({
            preference_score: Number(updatedPeferenceScore),
          })
          .then(() => {
            getSavedPersonalized(req, res);
          })
          .catch((error) => console.error("Update failed:", error));
      })
      .catch((error) => {
        console.log("function name: updatePreference axios error");
        console.log(error);
      });
  } catch (error) {
    console.log("function name: updatePreference from try & catch");
    res.statu(500).json({ message: "Something went wrong " });
  }
};

// ADDING SEARCHED PRODUCTS TO PERSONALIZED JSON FILE
const addSearchedDataToPersonalizedFile = async (req, personalizedData) => {
  const userFilePath = `data/personalizedData/${req.query.sessionId}.json`;
  if (fs.existsSync(userFilePath)) {
    fs.readFile(
      `data/currentSearchPersonalizedData/${req.query.sessionId}.json`,
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
            productData: personalizedData.map((product) => product),
          };
          // ADDING NEW PERSONALIZED DATA TO NEW ARRAY CONTAINING ALL PERSONALIZED DATA
          const newPersonalizedData = [...parsedData, newPersonalizedItem];
          fs.writeFile(
            `data/currentSearchPersonalizedData/${req.query.sessionId}.json`,
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
      productData: personalizedData.map((product) => {
        return product;
      }),
    };
    // CREATING PERSONALIZED DATA FOR THE FIRST TIME
    fs.writeFile(
      `data/currentSearchPersonalizedData/${req.query.sessionId}.json`,
      JSON.stringify([newPersonalizedItem]),
      (error) => {
        console.log(error);
      }
    );
  }
};
// GET SEARCH RESULT FROM SERPAPI API RESPOND AND ARE MODIFIED
const modifiedSearchedResult = async (req, searchedResult) => {
  // MODIFY SHOPPING_RESULTS
  if (searchedResult.data.shopping_results) {
    const data = searchedResult.data.shopping_results.map((product) => {
      return {
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
// MAKE FRESH API REQUEST TO GET NEW RELATED PRODUCTS TO CURRENT SEARCH
const makeNewSearch = async (req, res) => {
  try {
    const searchResult = await axios.get(
      `${baseAPI}&q=%22${formateProductName(
        `${req.query.currentSearch} accessories`
      )}%22&api_key=${serpapiKey}`
    );

    // GET MODIFIED SEARCHED DATA - RETURNS PROMISE
    const modifiedSearchedData = await modifiedSearchedResult(
      req,
      searchResult
    );

    // ADD PERSONALIZED DATA TO USER TEMPORARY JSON FILE
    if (modifiedSearchedData.length > 0) {
      addSearchedDataToPersonalizedFile(req, modifiedSearchedData);
    }
    // ADDING NEW SEARCHED PRODUCT TO DATABASE
    await knex("products").insert({
      name: req.body.currentSearch,
      preference_score: 1,
      user_id: req.query.userId,
    });
    // ADDING CURRENT SEARCH NAME TO DATABASE
    await knex("current_searches").insert({
      current_search: req.query.currentSearch,
      user_id: req.query.userId,
    });
    // SEDING RESPOND
    modifiedSearchedData.length > 0
      ? res.status(200).json(modifiedSearchedData)
      : res.status(200).json({
          // new function will be created to further handle this task
          message: "send any back up recommendation data from saved file",
        });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

// OPENING FUNCTION TO GETTING USER'S SEARCHED PERSONALIZED
const getCurrentSearchPersonalized = async (req, res) => {
  /*
  Check if similar search(which is this case is search with similar search-origin) has make before 
   */

  try {
    const hasSimilarSearchRecord = await knex("current_searches")
      .where("user_id", req.query.userId)
      .andWhere("current_search", req.query.currentSearch)
      .first();
    // get all search  history
    // const lastSearchNames = await knex("current_searches").where(
    //   "user_id",
    //   req.body.userId
    // );
    // check if current search is same as last search
    // const hasLastSearch = lastSearchNames.some((searchName) => {
    //   return searchName.current_search === req.body.currentSearch;
    // });
    // invoke conditional call-back functions
    hasSimilarSearchRecord
      ? updatePreferences(req, res)
      : makeNewSearch(req, res);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};
module.exports = { getCurrentSearchPersonalized };
