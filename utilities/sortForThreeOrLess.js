const axios = require("axios");
const baseAPI = process.env.API_URl;
const serpapiKey = process.env.API_KEY;
const sortForThreeOrLess = (res, data) => {
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
        shopping_results.forEach((item) => {
          // TAG PRODUCT ITEM WITH PREFERENCE SCORE
          if (counterIndex === 0) {
            item.score = "a";
          }
          if (counterIndex > 0 && counterIndex < 2) {
            item.score = "b";
          }
          if (counterIndex > 1) {
            item.score = "c";
          }
          // CREATE DESIRED PRODUCTS
          const filteredProduct = {
            id: item.product_id,
            title: item.title,
            preferenceScore: item.score,
            link: item.product_link,
            source: item.source,
            source_logo: item.source_icon,
            price: item.price,
            rating: item.ratiing,
            review: item.reviews,
            image: item.thumbnail,
            snippet: item.snippet,
          };
          recommendationProducts.push(filteredProduct);
        });
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

module.exports = sortForThreeOrLess;
