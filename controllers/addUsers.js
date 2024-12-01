const knex = require("knex")("../knexfile");
const { response } = require("express");
const { v4: uuid } = require("uuid");

const addUser = (req, res) => {
  // CREATE USER SESSION ID
  const sessionId = uuid();
  knex("users")
    .insert(sessionId)
    .then(
      knex("users")
        .where("sessionId", sessionId)
        .then((data) => {
          res.status(200).json({ message: "ok" });
          console.log(data);
        })
    );
};
module.exports = { addUser };
