const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
// 'dotenv'
require("dotenv").config();
// JSON PARSER
app.use(express.json());
const port = process.env.PORT || 8000;
// CORS
app.use(cors({ origin: 3000 }));
// start Express server
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
