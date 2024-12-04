const knex = require("knex")(require("../knexfile"));
const axios = require("axios");
const fs = require("fs");
const formateProductName = require("../utilities/formateProductName");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;

const getSavedPersonalized = (req, res) => {
  fs.readFile(`personalizedData/${req.body.sessionId}.json`, (error, data) => {
    if (error) {
      console.log(error);
      res.status(500).json({ message: "something went wrong" });
    }
    const personalizedData = JSON.parse(data);
    const currentSearchPersonalizedData = personalizedData.filter(
      (productLists) => {
        return (productLists.searchOrigin = req.body.currentSearch);
      }
    );
    res.status(200).json(currentSearchPersonalizedData[0]);
  });
};
const updatePreferences = async (req, res, lastSearchNames) => {
  // UPDATE PREFERENCE SCORE OF CURRENT SEARCHED PRODUCT
  try {
    await knex("products")
      .where("name", req.body.currentSearch)
      .andWhere("user_id", req.body.userId)
      .then((product) => {
        const updatedPeferenceScore = product[0].preference_score + 2; // actively search product by user will have double increment
        return updatedPeferenceScore;
      })
      .then((updatedPeferenceScore) => {
        knex("products")
          .where("name", req.body.currentSearch)
          .andWhere("user_id", req.body.userId)
          .update({
            preference_score: Number(updatedPeferenceScore),
          })
          .then(() => {
            getSavedPersonalized(req, res);
          })
          .catch((error) => console.error("Update failed:", error));
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    res.statu(500).json({ message: "Something went wrong " });
  }
};

const addSearchedDataToPersonalizedFile = async (req, personalizedData) => {
  fs.readFile(`personalizedData/${req.body.sessionId}.json`, (error, data) => {
    if (error) {
      console.log(error);
    }
    // PARSED EXISITING PERSONALIZED DATA
    const parsedData = JSON.parse(data);
    // CHECK IF DATABASE CONTAINS PREFERENCE DATA
    if (parsedData.length > 0) {
      // CREATE NEW PERSONALISED DATA FOR NEW SEARCH ORIGIN
      const newPersonalizedItem = {
        searchOrigin: req.body.currentSearch,
        productData: personalizedData.map((product) => product),
      };
      // ADDING NEW PERSONALIZED DATA TO NEW ARRAY CONTAINING ALL PERSONALIZED DATA
      const newPersonalizedData = [...parsedData, newPersonalizedItem];
      fs.writeFile(
        `personalizedData/${req.body.sessionId}.json`,
        JSON.stringify(newPersonalizedData),
        (error) => {
          console.log(error);
        }
      );
    } else {
      // CREATE NEW PERSONALISED DATA FOR NEW SEARCH ORIGIN
      const newPersonalizedItem = {
        searchOrigin: req.body.currentSearch,
        productData: personalizedData.map((product) => {
          return product;
        }),
      };
      // CREATING PERSONALIZED DATA FOR THE FIRST TIME
      fs.writeFile(
        `personalizedData/${req.body.sessionId}.json`,
        JSON.stringify([newPersonalizedItem]),
        (error) => {
          console.log(error);
        }
      );
    }
  });
};
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

const makeNewSearch = async (req, res) => {
  try {
    const searchResult = await axios.get(
      `${baseAPI}&q=%22${formateProductName(
        `${req.body.currentSearch} accessories`
      )}%22&api_key=${serpapiKey}`
    );

    // GET MODIFIED SEARCHED DATA
    const modifiedSearchedData = getSearchedResult(req, searchResult);
    // ADD PERSONALIZED DATA TO USER TEMPORARY JSON FILE
    if (modifiedSearchedData.data.length > 0) {
      addSearchedDataToPersonalizedFile(req, modifiedSearchedData.data);
    }
    // ADDING NEW SEARCHED PRODUCT TO DATABASE
    await knex("products").insert({
      name: req.body.currentSearch,
      preference_score: 1,
      user_id: req.body.userId,
    });
    // ADDING CURRENT SEARCH NAME TO DATABASE
    await knex("current_searches").insert({
      current_search: req.body.currentSearch,
      user_id: req.body.userId,
    });
    // SEDING RESPOND
    modifiedSearchedData.data.length > 0
      ? res.status(200).json(modifiedSearchedData.data)
      : res.status(200).json({
          // new function will be created to further handle this task
          message: "send any back up recommendation data from saved file",
        });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

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
    hasLastSearch ? updatePreferences(req, res) : makeNewSearch(req, res);
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
    });
  }
};
module.exports = { getCurrentSearchPersonalized };
