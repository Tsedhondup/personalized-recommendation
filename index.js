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
const userRoute = require("./routes/userRoutes");
const currentSearchPersonalizedRoute = require("./routes/currentSearchPersonalizedRoute");
const mainPersonalizedRoute = require("./routes/mainPersonalizedRoute");

app.use("/currentSearchPersonalized", currentSearchPersonalizedRoute);
app.use("/mainPersonalized", mainPersonalizedRoute);
app.use("/user", userRoute);

// START EXPRESS SERVER
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
