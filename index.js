const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
// 'dotenv'
require("dotenv").config();
// JSON PARSER
app.use(express.json());
// PORT
const port = process.env.PORT || 8000;
// CORS
app.use(cors({ origin: 3000 }));

// ROUTES
const productsRoute = require("./routes/newProduct");
const recommendationRoute = require("./routes/recommendationLists");
const currentDataRoute = require("./routes/currentData");
const preferenceRoute = require("./routes/preferenceScore");
const addCustomPreferences = require("./routes/addCustomPreferences");
app.get("/products", productsRoute); // fresh data from serpapi API
app.get("/recommendations", recommendationRoute); // fresh data from serpapi API
app.get("/currentData", currentDataRoute); // fresh data from serpapi API

app.post("/preferences", preferenceRoute); // add to local database
app.post("/addCustomPreferences", addCustomPreferences); // add to local database

// START EXPRESS SERVER
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
