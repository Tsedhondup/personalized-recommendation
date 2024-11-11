const express = require("express");
const router = express.Router();
const fs = require("fs");

const addPreferencesData = (data) => {
  fs.writeFile("data/preferences.json", JSON.stringify([data]), (err) => {
    if (err) {
      res.status(500).json({ message: "Internal Server Error" });
    }
    res.status(200).json({ Message: "Preferences recieved" });
  });
};

router.post("/addCustomPreferences", (req, res, next) => {
  const preferenceData = {
    userId: req.body.userId,
    data: [...req.body.customProductTypes],
  };

  addPreferencesData(preferenceData);
});
module.exports = router;
