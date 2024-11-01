const axios = require("axios");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const createFilteredProduct = (productData, index) => {
  const filteredProduct = {
    id: productData[index].product_id,
    title: productData[index].title,
    preferenceScore: productData[index].score,
    link: productData[index].product_link,
    source: productData[index].source,
    source_logo: productData[index].source_icon,
    price: productData[index].price,
    rating: productData[index].ratiing,
    review: productData[index].reviews,
    image: productData[index].thumbnail,
    snippet: productData[index].snippet,
  };

  return filteredProduct;
};
const sortForMoreThanThree = (res, data) => {
  const recommendationData = data.sort((item1, item2) => {
    item2.preferenceScore - item1.preferenceScore;
  });
  // COUTNER INDEX
  let counterIndex = 0;
  const recommendationProducts = [];
  recommendationData.forEach((item) => {
    axios
      .get(`${baseAPI}&q=%22${item.productName}%22&api_key=${serpapiKey}`)
      .then((respond) => {
        const shopping_results = respond.data.shopping_results;
        return shopping_results;
      })
      .then((shopping_results) => {
        // TAG PRODUCT ITEM WITH PREFERENCE SCORE
        if (counterIndex === 0) {
          item.score = "a";
          // 60% OF FROM THE TOTAL PRODUCTS WILL BE SEND
          const totalProduct = shopping_results.length;
          const totalProductToSend = totalProduct * 0.6; // approx = 24 products
          for (let index = 0; index < totalProductToSend; index++) {
            recommendationProducts.push(
              createFilteredProduct(shopping_results, index)
            );
          }
        }
        if (counterIndex > 0 && counterIndex < 2) {
          item.score = "b";
          // 30% OF FROM THE TOTAL PRODUCTS WILL BE SEND
          const totalProduct = shopping_results.length;
          const totalProductToSend = totalProduct * 0.3; // approx = 12 products
          for (let index = 0; index < totalProductToSend; index++) {
            recommendationProducts.push(
              createFilteredProduct(shopping_results, index)
            );
          }
        }
        if (counterIndex > 1) {
          item.score = "c";
          // 10% OF FROM THE TOTAL PRODUCTS WILL BE SEND
          const totalProduct = shopping_results.length;
          const totalProductToSend = totalProduct * 0.1; // approx = 4 products
          for (let index = 0; index < totalProductToSend; index++) {
            recommendationProducts.push(
              createFilteredProduct(shopping_results, index)
            );
          }
        }

        // CREATE DESIRED PRODUCTS
        counterIndex = counterIndex + 1;
      })
      .then(() => {
        // RESPOND IS BEING SENT ONLY AFTER THE EVENTUAL COMPLETION OF LOOP
        counterIndex === recommendationData.length
          ? res.status(200).json(recommendationProducts)
          : "";
      })
      .catch((error) => {
        res.status(500).json("Internal Server Error");
      });
  });
};

module.exports = sortForMoreThanThree;
