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
app.get("/products", productsRoute); // fresh data from serpapi API
// app.get("/product/:id", profileRoute); // collected data from local database
// app.get("/product/carts", profileRoute); // collected data from local database
// app.get("/product/likes", profileRoute); // collected data from local database
app.get("/recommendations", recommendationRoute); // fresh data from serpapi API

// app.post("/product/carts", profileRoute); // add to local database
// app.post("/product/likes", profileRoute); // add to local database

// app.patch("/product/carts/:id", profileRoute); // update local database
// app.patch("/product/likes/:id", profileRoute); // update local database

// START EXPRESS SERVER
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
