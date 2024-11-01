const fs = require("fs");
// CREATE CURRENT PRODUCTS
const handleuCrrentProducts = (data) => {
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
