const fs = require("fs");

const getCurrentSearchData = (req, res) => {
  fs.readFile(`data/SearchData${req.query.sessionId}`, (error, data) => {
    if (error) {
      res.status(500).json([]); // preventing app from crashin on client siteF
    }
    const parsedData = JSON.parse(data);
    if (parsedData.length > 0) {
      const currentSearchData = parsedData.filter((item) => {
        return item.sessionId === req.query.currentSearchId;
      });
      if (currentSearchData.length > 0) {
        res.status(200).json(currentSearchData);
      } else {
        res.status(200).json([]);
      }
    }
  });
};

module.exports = { getCurrentSearchData };
