const fs = require("fs");
// CREATE CURRENT PRODUCTS
const handleCurrentProducts = (data) => {
  fs.writeFile("data/currentProducts.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
};
// CREATE CURRENT RECOMMENDATION PRODUCTS
const handleCurrentRecommendations = (data) => {
  fs.writeFile(
    "data/currentRecommendations.json",
    JSON.stringify(data),
    (err) => {
      console.log(err);
    }
  );
};
module.exports = handleCurrentProducts;
// module.exports = handleCurrentRecommendations;
