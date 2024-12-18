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
const newProductRoute = require("./routes/searchNewProductRoute");
const currentSearchDataRoute = require("./routes/currentSearchDataRoute");
const currentSearchPersonalizedRoute = require("./routes/currentSearchPersonalizedRoute");
const mainPersonalizedRoute = require("./routes/mainPersonalizedRoute");
const savedPersonalizedRoute = require("./routes/savedPersonalizedRoute");
const currentMainPersonalizeDataRoute = require("./routes/currentMainPersonalizedDataRoute");
const likedPersonalizedRoute = require("./routes/likedPersonalizedRoute");
const historyPersonalizedRoute = require("./routes/historyPersonalizedRoute");
// require parameters: customed/selected products from users
app.use("/user", userRoute);
// require parameter: product name, userId, sessionId
app.use("/newProduct", newProductRoute);
// require parameter: currentSearchId, userId, sessionId
app.use("/currentSearchData", currentSearchDataRoute);
// require parameters: userId, currentSearch/searchOrigin, sessionId,
app.use("/currentSearchPersonalized", currentSearchPersonalizedRoute);
// require parameters: userId, sessionId
app.use("/mainPersonalized", mainPersonalizedRoute);
// require paramtets: userId, sessionId
app.use("/currentMainPersonalized", currentMainPersonalizeDataRoute);
// require parameters: userId, saving-product for post only
app.use("/savedPersonalized", savedPersonalizedRoute);
// require parameters: userId, saving-product for post only
app.use("/likedPersonalized", likedPersonalizedRoute);
// require parameters: userId, saving-product for post only
app.use("/historyPersonalized", historyPersonalizedRoute);

// START EXPRESS SERVER
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
