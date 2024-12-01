const knex = require("knex")(require("../knexfile"));

// const knex = require("knex")("../knexfile"); // promt to installe sqlite3 : investigate later
const { v4: uuid } = require("uuid");

const addUser = (_req, res) => {
  // CREATE USER SESSION ID
  const sessionId = uuid();
  knex("users")
    .insert({ sessionId })
    .then((newUser) => {
      knex("users")
        .where("user_id", newUser[0])
        .then((data) => {
          const respondData = data[0];
          res.status(200).json(respondData);
        });
    })
    .catch((error) => {
      console.log(error);
    });
};
module.exports = { addUser };
