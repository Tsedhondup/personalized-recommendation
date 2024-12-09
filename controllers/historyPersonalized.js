const knex = require("knex")(require("../knexfile"));

const getHistoryPersonalized = async (req, res) => {
  try {
    const histortyPersonalized = await knex("history_products").where(
      "user_id",
      req.body.userId
    );
    res.status(200).json(histortyPersonalized);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const addHistoryPersonalized = async (req, res) => {
  try {
    const newHistoryProduct = await knex("history_products").insert(
      req.body.likedData
    );
    res.status(200).json(newHistoryProduct);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { getHistoryPersonalized, addHistoryPersonalized };
