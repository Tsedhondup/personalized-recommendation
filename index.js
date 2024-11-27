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
const newProductsRoute = require("./routes/newProducts");
const getRecommendationRoute = require("./routes/getRecommendations");
const getCurrentDataRoute = require("./routes/getCurrentProducts");
const preferenceRoute = require("./routes/preferenceScore");
const addCustomPreferences = require("./routes/addCustomPreferences");
app.get("/getRecommendations", getRecommendationRoute); // fresh data from serpapi API
app.get("/getCurrentProducts", getCurrentDataRoute); // fresh data from serpapi API

app.post("/newProducts", newProductsRoute); // fresh data from serpapi API
app.post("/preferences", preferenceRoute); // add to local database
app.post("/addCustomPreferences", addCustomPreferences); // add to local database

// START EXPRESS SERVER
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
