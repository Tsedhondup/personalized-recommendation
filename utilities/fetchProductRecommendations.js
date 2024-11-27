const axios = require("axios");
const baseAPI = process.env.API_URL;
const serpapiKey = process.env.API_KEY;
const formateProductName = require("./formateProductName");

const createFilteredProduct = (productData, index) => {
  const filteredProduct = {
    id: productData[index].product_id,
    title: productData[index].title,
    preferenceScore: productData[index].score,
    link: productData[index].product_link,
    source: productData[index].source,
    source_logo: productData[index].source_icon,
    price: productData[index].price,
    rating: productData[index].rating, // Fixed typo here
    review: productData[index].reviews,
    image: productData[index].thumbnail,
    snippet: productData[index].snippet,
  };
  return filteredProduct;
};

const fetchProductRecommendations = async (res, data) => {
  const recommendationData = data.sort(
    (item1, item2) => item2.preferenceScore - item1.preferenceScore
  );

  const recommendationProducts = [];
  let counterIndex = 0;

  try {
    // Use Promise.all to wait for all API calls to complete
    await Promise.all(
      recommendationData.map(async (item) => {
        const response = await axios.get(
          `${baseAPI}&q=%22${formateProductName(
            item.productName
          )}%22&api_key=${serpapiKey}`
        );

        const shopping_results = response.data.shopping_results;

        if (counterIndex === 0) {
          item.score = "a";
          const totalProductToSend = Math.floor(shopping_results.length * 0.6);
          for (let index = 0; index < totalProductToSend; index++) {
            recommendationProducts.push(
              createFilteredProduct(shopping_results, index)
            );
          }
        } else if (counterIndex > 0 && counterIndex < 2) {
          item.score = "b";
          const totalProductToSend = Math.floor(shopping_results.length * 0.3);
          for (let index = 0; index < totalProductToSend; index++) {
            recommendationProducts.push(
              createFilteredProduct(shopping_results, index)
            );
          }
        } else if (counterIndex > 1 && counterIndex < 4) {
          item.score = "c";
          const totalProductToSend = Math.floor(shopping_results.length * 0.1);
          for (let index = 0; index < totalProductToSend; index++) {
            recommendationProducts.push(
              createFilteredProduct(shopping_results, index)
            );
          }
        }

        counterIndex += 1;
      })
    );

    // Send the response after all API requests are done
    res.status(200).json(recommendationProducts);
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};

module.exports = fetchProductRecommendations;
