const knex = require("knex")(require("../knexfile"));

const getSavedPersonalized = async (req, res) => {
  try {
    const savedPersonalized = await knex("saved_products").where(
      "user_id",
      req.body.userId
    );
    res.status(200).json(savedPersonalized);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

const addSavedPersonalized = async (req, res) => {
  try {
    const newlyAddedSavedProduct = await knex("saved_products").insert(
      req.body.savedData
    );
    res.status(200).json(newlyAddedSavedProduct);
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};
// DELETE ENTIRE USER'S DATA
const removeUser = async (req, res) => {
  await knex("saved_products").where("user_id", req.body.userId).delete();
  await knex("liked_products").where("user_id", req.body.userId).delete();
  await knex("history_products").where("user_id", req.body.userId).delete();
  await knex("current_searches").where("user_id", req.body.userId).delete();
  await knex("sources").where("user_id", req.body.userId).delete();
  await knex("products").where("user_id", req.body.userId).delete();
  await knex("users").where("user_id", req.body.userId).delete();
};
module.exports = { getSavedPersonalized, addSavedPersonalized, removeUser };
