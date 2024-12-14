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
const deleteSavedPersonalized = async (req, res) => {
  try {
    await knex("saved_products").where("id", req.body.savedProductId).del();
    res.status(200).json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

module.exports = {
  getSavedPersonalized,
  addSavedPersonalized,
  deleteSavedPersonalized,
};
