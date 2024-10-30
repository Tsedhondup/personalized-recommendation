const fs = require("fs");
// const createPreferences = () => {};
// const updatePreferences = () => {};

const writeFile = (data) => {
  fs.writeFile("data/preferences.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
};
const validatePreferences = (productName) => {
  // RETRIEVE PREFERENCE DATA
  fs.readFile("data/preferences.json", (err, data) => {
    // console.log(JSON.parse(data));
    if (err) {
      console.log(err);
      return;
    }
    if (JSON.parse(data.length > 0)) {
      const preferenceData = JSON.parse(data);
      console.log(preferenceData.length);
      // ARRAY TO STORE PREFERENCE DATA
      const preferenceDataCopy = preferenceData.map((item) => {
        // UPDATE THE PREFERENCE SCORE WITH NEW DATA AND STORE IN A VARIABLE
        if (item.productName === productName) {
          item.preferenceScore = item.preferenceScore + 1;
        }
        return item;
      });
      writeFile(preferenceDataCopy);
    } else {
      const preferenceData = [
        {
          productName: productName,
          preferenceScore: 1,
        },
      ];
      writeFile(preferenceData);
    }
  });
};
module.exports = validatePreferences;
