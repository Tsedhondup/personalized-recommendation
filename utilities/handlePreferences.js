const fs = require("fs");

// MAIN FUNCTION TO UPDATE DATABASE****
const writeFile = (data) => {
  fs.writeFile("data/preferences.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
};
// CREATE DATABASE DURING FIRST POST**
const createPreferences = (productName) => {
  const preferenceData = [
    {
      productName: productName,
      preferenceScore: 1,
    },
  ];
  writeFile(preferenceData);
};
// UPDATE EXISTING DATABASE**
const updatePreferences = (preferenceData, productName) => {
  // CREATE A SHALOW COPY OF DATABASE WITH UPDATED PREFERENCE SCORE
  const preferenceDataCopy = preferenceData.map((item) => {
    // UPDATE THE PREFERENCE SCORE WITH NEW DATA AND STORE IN A VARIABLE
    if (item.productName === productName) {
      item.preferenceScore = item.preferenceScore + 1;
    }
    return item;
  });
  writeFile(preferenceDataCopy);
};
// ADD NEW PRODUCT TO EXISTING DATABASE**
const addPreferences = (preferenceData, newProductName) => {
  // CREATE NEW PRODUCT OBJECT
  const newProduct = { productName: newProductName, preferenceScore: 1 };
  preferenceData.push(newProduct);
  console.log(preferenceData + "yes");
  writeFile(preferenceData);
  return;
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
      // CHECK IF SAME PRODUCT EXIST
      let isDataMatch = false;
      preferenceData.forEach((item) => {
        if (item.productName == productName) {
          isDataMatch = true;
        }
      });
      // CASE - 1**** IF SAME PRODUCT DOES NOT EXIST, CREATE NEW PRODUCT OBJECT AND ADD TO DATABASE
      if (!isDataMatch) {
        addPreferences(preferenceData, productName);
      }
      // CAE -2 **** IF SAME PRODUCT EXIST, UPDATE THE EXISTING PRODUCT PREFERENCE SCORE
      if (isDataMatch) {
        updatePreferences(preferenceData, productName);
      }
    } else {
      // IF DATABASE IS EMPTY, CREATE DATABASE**********
      createPreferences(productName);
    }
  });
};
module.exports = validatePreferences;
