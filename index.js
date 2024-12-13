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
const savedPersonalizedRoute = require("./routes/savedPersonalizedRoute");
const likedPersonalizedRoute = require("./routes/likedPersonalizedRoute");
const historyPersonalizedRoute = require("./routes/historyPersonalizedRoute");
// require paraments: userId, currentSearch/searchOrigin, sessiionId,
app.use("/currentSearchPersonalized", currentSearchPersonalizedRoute);
// require paraments: userId, sessionId
app.use("/mainPersonalized", mainPersonalizedRoute);
// require paraments: customed/selected products from users
app.use("/user", userRoute);
// require paraments: userId, saving-product for post only
app.use("/savedPersonalized", savedPersonalizedRoute);
// require paraments: userId, saving-product for post only
app.use("/likedPersonalized", likedPersonalizedRoute);
// require paraments: userId, saving-product for post only
app.use("/historyPersonalized", historyPersonalizedRoute);

// START EXPRESS SERVER
app.listen(port, () => {
  console.log(`App is listening on port ${port}`);
});
