const knex = require("knex")(require("../knexfile"));

const getSavedPersonalized = async (req, res) => {
  const savedPersonalized = await knex("saved_products").where(
    "user_id",
    req.body.userId
  );
  res.status(200).json(savedPersonalized);
};

module.exports = { getSavedPersonalized };
