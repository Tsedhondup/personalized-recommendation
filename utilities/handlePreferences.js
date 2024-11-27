const fs = require("fs");

// MAIN FUNCTION TO UPDATE DATABASE****
const writeFile = async (data) => {
  fs.writeFile("data/userData.json", JSON.stringify(data), (err) => {
    console.log(err);
    return;
  });
};
// CREATE DATABASE DURING FIRST POST**
const createPreferencesData = (userId, productName, sourceName) => {
  const id = userId;
  const product = productName;
  const source = sourceName;

  const preferenceData = [
    {
      userId: id,
      data: [
        {
          productName: product,
          preferenceScore: 1,
          source: [
            {
              name: source,
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
const updateUser = (userId, productName, sourceName, currentData) => {
  // LOOP THROUGH CURRENT DATA
  for (let i = 0; i < currentData.length; i++) {
    // FIDING MATCHED USER ID
    if (currentData[i].userId === userId) {
      // CHECK IF SAME PRODUCT EXIST OR NOT USING FOOR LOOP
      for (let ii = 0; ii < currentData[i].data.length; ii++) {
        // IF SAME PRODUCT NAME EXIST -------------------------------------- PRODUCT NAME CHECK
        if (currentData[i].data[ii].productName === productName) {
          // 1st : INCREASE PREFERENCE SCORE CURRENT PRODUCT BY +1
          currentData[i].data[ii].preferenceScore += 1;
          console.log(currentData[i].data[ii]);
          // 2nd : CHECK SOURC NAME EXIST OR NOT USING FOOR LOOP
          for (
            let iii = 0;
            iii < currentData[i].data[ii].source.length;
            iii++
          ) {
            // SOURCE NAME DO EXIST ---------------------------- SOURCE NAME CHECK
            if (currentData[i].data[ii].source[iii].name === sourceName) {
              currentData[i].data[ii].source[iii].score += 1;
            } else {
              // SOURCE NAME DO NOT EXIST ------------------------ SOURCE NAME CHECK
              const newBrand = {
                name: sourceName,
                score: 1,
              };
              currentData[i].data[ii].source.push(newBrand);
            }
          }
        } else {
          // IF SAME PRODUCT DO NOT EXIST -------------------------------------- PRODUCT NAME CHECK
          const newProductData = {
            productName: productName,
            preferenceScore: 1,
            brand: [{ name: sourceName, preferenceScore: 1 }],
          };
          // ADD NEW PRODUCT TO USER DATA ARRAY
          currentData[i].data.push(newProductData);
        }
      }
    }
  }
  writeFile(currentData);
};
// ADD NEW PRODUCT TO EXISTING DATABASE**
const addUser = (userId, productName, sourceName, currentData) => {
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
  fs.readFile("data/userData.json", (err, data) => {
    if (err) {
      console.log(err);
      return;
    }
    const parsedData = JSON.parse(data); // get preference data
    // CHECK IF DATABASE CONTAINS PREFERENCE DATA
    if (parsedData.length > 0) {
      parsedData.forEach((element) => {
        if (element.userId === userId) {
          // CASE-1 : IF USER ID DOES EXIST
          updateUser(userId, productName, sourceName, parsedData);
        } else {
          // CASE-2 : IF USER ID DO NOT EXIST
          addUser(userId, productName, sourceName, parsedData);
        }
      });
    } else {
      // CREATE DATABASE FOR THE FIRST TIME
      createPreferencesData(userId, productName, sourceName, parsedData);
    }
  });
};
module.exports = handlePreferencesData;
