const knex = require("knex")(require("../knexfile"));

const getNotFirstTimePersonalized = async (req, res, productLists) => {
  // CHECK IF CURRENT SEARCH NAME BY USER IS CHANGE OR NOT

  try {
    // GET USER'S LAST SEARCH INPUT
    const currentSearch = await knex("current_searches").where(
      "user_id",
      req.body.userId
    );
    // CHECK USER'S LAST SEARCH INPUT EXISTS OR NOT
    if (currentSearch.length > 0) {
      // COMPARE USER'S CURRENT AND LAST SEARCH INPUTS
      if (currentSearch[0].current_search === req.body.currentSearch) {
        console.log(currentSearch);
        res.status(200).json({ message: "same search name" });
      } else {
        res.status(200).json({ message: "search name has changed now" });
      }
    } else {
      res.status(200).json({ message: "you do not have current search" });
    }
  } catch (error) {
    res.status(500).json(error);
  }
  // try {
  //   const productArray = productLists.map(async (product) => {
  //     const searchResult = await axios
  //       .get(
  //         `${baseAPI}&q=%22${formateProductName(
  //           product.productName
  //         )}%22&api_key=${serpapiKey}`
  //       )
  //       .then((result) => {
  //         return result.data.shopping_results;
  //       });
  //     return searchResult;
  //   });
  //   // Wait for all API calls to complete
  //   const products = await Promise.all(productArray);
  //   res.status(200).json(products);
  // } catch (error) {
  //   res.status(500).json(error);
  // }
};
module.exports = getNotFirstTimePersonalized;
