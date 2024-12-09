const knex = require("knex")(require("../knexfile"));

const getLikedPersonalized = async (req, res) => {
  try {
    const likedPersonalized = await knex("liked_products").where(
      "user_id",
      req.body.userId
    );
    res.status(200).json(likedPersonalized);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const addLikedPersonalized = async (req, res) => {
  try {
    const newlyLikedProduct = await knex("liked_products").insert(
      req.body.likedData
    );
    res.status(200).json(newlyLikedProduct);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = { getLikedPersonalized, addLikedPersonalized };
