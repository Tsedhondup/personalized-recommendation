const fs = require("fs");
// CREATE CURRENT PRODUCTS

const updateCurrentData = (newData) => {
  fs.writeFile("data/currentProducts.json", JSON.stringify(newData), (err) => {
    console.log(err);
  });
};
const addCurrentProducts = (newData) => {
  fs.readFile("data/currentProducts.json", (err, data) => {
    // UPDATE CURRENT DATA JSON FILE WITH NEW DATA
    updateCurrentData([...JSON.parse(data), newData]);
  });
};

module.exports = addCurrentProducts;
// module.exports = handleCurrentRecommendations;
