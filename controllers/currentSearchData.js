const fs = require("fs");

const getCurrentSearchData = (req, res) => {
  fs.readFile(`data/SearchData${req.query.sessionId}`, (error, data) => {
    if (error) {
      res.status(500).json([]); // preventing app from crashin on client siteF
    }
    const parsedData = JSON.parse(data);
    if (parsedData.length > 0) {
      parsedData.filter((item) => {});
      return item.sessionId === req.query.currentSearchId;
    }
  });
};

const sendCurrentSearchData = (req, res) => {
  const currentSearchData = getCurrentSearchData(req, res);

  if (currentSearchData.length > 0) {
    res.status(200).json(currentSearchData);
  } else {
    res.status(200).json([]);
  }
};

module.exports = { sendCurrentSearchData };
