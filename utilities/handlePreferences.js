const fs = require("fs");

// MAIN FUNCTION TO UPDATE DATABASE****
const writeFile = async (data) => {
  fs.writeFile("data/preferenceData.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
};
// CREATE DATABASE DURING FIRST POST**
const createPreferencesData = (userId, productName, sourceName) => {
  const preferenceData = [
    {
      userId: userId,
      data: [
        {
          productName: productName,
          preferenceScore: 1,
          source: [
            {
              name: sourceName,
              score: 1,
            },
          ],
        },
      ],
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
const addPreferences = (userId, productName, sourceName, currentData) => {
  // CREATE NEW PRODUCT OBJECT
  const newPreferenceData = {
    userId: userId,
    data: [
      {
        productName: productName,
        preferenceScore: 1,
        source: {
          name: sourceName,
          score: 1,
        },
      },
    ],
  };
  currentData.push(newPreferenceData);
  writeFile(currentData);
  return;
};

const handlePreferencesData = (userId, productName, sourceName) => {
  // RETRIEVE PREFERENCE DATA FROM DATABASE
  fs.readFile("data/preferenceData.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const parsedData = JSON.parse(data); // get preference data
    let isUserId = false; // if user id is present or not
    // CHECK IF DATABASE CONTAINS PREFERENCE DATA
    if (parsedData.length > 0) {
      for (i = 0; i > parsedData.length; i++) {
        // IF SAME USER EXIST
        if (parsedData[i].userId === userId) {
          isUserId = true;
        }
      }

      // CASE-1 : IF USER ID DOES EXIST

      // CASE-2 : IF USER ID DO NOT EXIST
      addPreferences(userId, productName, sourceName, parsedData);
    } else {
      // CREATE DATABASE FOR THE FIRST TIME
      createPreferencesData(userId, productName, sourceName, parsedData);
    }
  });
};
module.exports = handlePreferencesData;
