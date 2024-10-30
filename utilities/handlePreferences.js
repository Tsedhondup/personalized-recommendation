const fs = require("fs");
// const createPreferences = () => {};
// const updatePreferences = () => {};

const writeFile = (data) => {
  fs.writeFile("data/preferences.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
};
const validatePreferences = (productName) => {
  // RETRIEVE PREFERENCE DATA FROM DATABASE
  fs.readFile("data/preferences.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    // CHECK IF DATABASE CONTAINS DATA**********
    if (JSON.parse(data.length > 0)) {
      const preferenceData = JSON.parse(data);
      // CASE - 1 : CHECK IF SAME PRODUCT EXIST, IF YES, INCREMENT THE PREFERENCE SCORE BY +1
      let isDataMatch = false;
      preferenceData.forEach((item) => {
        if (item.productName == productName) {
          isDataMatch = true;
        }
      });
      // CASE - 1**** IF SAME PRODUCT DOES NOT EXIST, CREATE NEW PRODUCT OBJECT AND ADD TO DATABASE
      if (!isDataMatch) {
        // CREATE NEW PRODUCT OBJECT
        const newProduct = { productName: productName, preferenceScore: 1 };
        preferenceData.push(newProduct);
        console.log(preferenceData + "yes");
        writeFile(preferenceData);
        return;
      }
      // CAE -2 **** IF SAME PRODUCT EXIST
      if (isDataMatch) {
        // CREATE A SHALOW COPY OF DATABASE WITH UPDATED PREFERENCE SCORE
        const preferenceDataCopy = preferenceData.map((item) => {
          // UPDATE THE PREFERENCE SCORE WITH NEW DATA AND STORE IN A VARIABLE
          if (item.productName === productName) {
            item.preferenceScore = item.preferenceScore + 1;
          }
          return item;
        });
        writeFile(preferenceDataCopy);
      }
    } else {
      // IF DATABASE HAS NO DATA, CREATE NEW DATA**********
      const preferenceData = [
        {
          productName: productName,
          preferenceScore: 1,
        },
      ];
      writeFile(preferenceData);
      return;
    }
  });
};
module.exports = validatePreferences;
