const fs = require("fs");

// MAIN FUNCTION TO UPDATE DATABASE****
const writeFile = async (data) => {
  fs.writeFile("data/preferences.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
};
// CREATE DATABASE DURING FIRST POST**
const createPreferences = (productName, userId) => {
  const preferenceData = [
    {
      userId: userId,
      data: [{ productName: productName, preferenceScore: 1 }],
    },
  ];
  writeFile(preferenceData);
};
// UPDATE EXISTING DATABASE**
const updatePreferences = (preferenceData, productName, userId) => {
  // CREATE A SHALOW COPY OF DATABASE WITH UPDATED PREFERENCE SCORE
  const preferenceDataCopy = preferenceData.map((element0) => {
    // CHECK IF USER ID IS FOUND
    if (element0.userId === userId) {
      // check if same product exist or not
      let sameProductExist = false;
      element0.data.forEach((element2) => {
        sameProductExist = element2.productName === productName ? true : false;
      });
      // CASE-1
      if (sameProductExist) {
        element0.data.forEach((element1) => {
          if (element1.productName === productName) {
            element1.preferenceScore = element1.preferenceScore + 1;
          }
        });
      } // CASE-2
      else {
        const newPreferenceData = {
          productName: productName,
          preferenceScore: 1,
        };
        element0.data.push(newPreferenceData);
      }
    }

    return element0;
  });
  writeFile(preferenceDataCopy);
};
// ADD NEW PRODUCT TO EXISTING DATABASE**
const addPreferences = (preferenceData, newProductName, userId) => {
  // CREATE NEW PRODUCT OBJECT
  const newPreferenceData = {
    userId: userId,
    data: [{ productName: newProductName, preferenceScore: 1 }],
  };
  preferenceData.push(newPreferenceData);
  writeFile(preferenceData);
  return;
};

const validatePreferences = (productName, userId) => {
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
        // *** id will be check instead of product name
        if (item.userId == userId) {
          isDataMatch = true;
        }
      });

      // CASE - 1**** IF SAME PRODUCT DOES NOT EXIST, CREATE NEW PRODUCT OBJECT AND ADD TO DATABASE
      if (!isDataMatch) {
        addPreferences(preferenceData, productName, userId);
      }
      // CAE -2 **** IF SAME PRODUCT EXIST, UPDATE THE EXISTING PRODUCT PREFERENCE SCORE
      if (isDataMatch) {
        updatePreferences(preferenceData, productName, userId);
      }
    } else {
      // IF DATABASE IS EMPTY, CREATE DATABASE**********
      createPreferences(productName, userId);
    }
  });
};
module.exports = validatePreferences;
