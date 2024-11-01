const fs = require("fs");
// CREATE CURRENT PRODUCTS
const addCurrentProducts = (data) => {
  fs.writeFile("data/currentProducts.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
};
// CREATE CURRENT RECOMMENDATION PRODUCTS
const addCurrentRecommendations = (data) => {
  fs.writeFile(
    "data/currentRecommendations.json",
    JSON.stringify(data),
    (err) => {
      console.log(err);
    }
  );
};
module.exports = addCurrentProducts;
// module.exports = handleCurrentRecommendations;
