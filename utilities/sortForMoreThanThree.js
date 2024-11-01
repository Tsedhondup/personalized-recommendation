const sortForMoreThanThree = (res, data) => {
  const recommendationData = data.sort((item1, item2) => {
    item2.preferenceScore - item1.preferenceScore;
  });
  res.status(200).json({ recommendationData });
};

module.exports = sortForMoreThanThree;
