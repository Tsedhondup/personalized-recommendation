const usersData = require("../seed-data/users");
const productsData = require("../seed-data/products");
const sourcesData = require("../seed-data/sources");
const currentSearchData = require("../seed-data/current_searches");
const historyData = require("../seed-data/history");
const savedData = require("../seed-data/saveProducts");
const likedData = require("../seed-data/likedProducts");
exports.seed = async function (knex) {
  // DELETE ALL EXISTING DATA
  await knex("saved_products").del();
  await knex("liked_products").del();
  await knex("history_products").del();
  await knex("sources").del();
  await knex("current_searches").del();
  await knex("products").del();
  await knex("users").del();

  // INSERTING NEW SEED DATA
  await knex("users").insert(usersData);
  await knex("products").insert(productsData);
  await knex("current_searches").insert(currentSearchData);
  await knex("sources").insert(sourcesData);
  await knex("history_products").insert(historyData);
  await knex("liked_products").insert(likedData);
  await knex("saved_products").insert(savedData);
};
