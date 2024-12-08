// GET SEARCH RESULT FROM SERPAPI API RESPOND AND ARE MODIFIED
const filterSearchedResult = (req, searchedResult) => {
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

module.exports = filterSearchedResult;
