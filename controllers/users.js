const knex = require("knex")(require("../knexfile"));

// const knex = require("knex")("../knexfile"); // promt to installe sqlite3 : investigate later
const { v4: uuid } = require("uuid");

const addCustomProducts = (req, res, user) => {
  for (let i = 0; i < req.body.products.length; i++) {
    knex("products")
      .insert({
        name: req.body.products[i],
        preference_score: 1,
        user_id: user.user_id,
      })
      .catch((error) => {
        console.log(error);
      });
  }
  res.status(200).json(user);
};

const addUser = (req, res) => {
  // CREATE USER SESSION ID
  const sessionId = uuid();
  knex("users")
    .insert({ sessionId })
    .then((newUser) => {
      knex("users")
        .where("user_id", newUser[0])
        .then((data) => {
          addCustomProducts(req, res, data[0]);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
// DELETE ENTIRE USER'S DATA
const removeUser = async (req, res) => {
  try {
    await knex("saved_products").where("user_id", req.body.userId).delete();
    await knex("liked_products").where("user_id", req.body.userId).delete();
    await knex("history_products").where("user_id", req.body.userId).delete();
    await knex("current_searches").where("user_id", req.body.userId).delete();
    await knex("sources").where("user_id", req.body.userId).delete();
    await knex("products").where("user_id", req.body.userId).delete();
    await knex("users").where("user_id", req.body.userId).delete();
    res.status(200).json({ message: "Task completed successfully" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { addUser, removeUser };
