const express = require("express");
const router = express.Router();
const fs = require("fs");

router.post("/addCustomPreferences", (req, res, next) => {
  fs.writeFile("data/preferences.json", JSON.stringify(req.body), (err) => {
    if (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ Message: "Preferences recieved" });
  });
});
module.exports = router;
