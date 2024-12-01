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
      .then(() => {
        res.status(200).json(user);
      })
      .catch((error) => {
        console.log(error);
      });
  }
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

module.exports = { addUser };
