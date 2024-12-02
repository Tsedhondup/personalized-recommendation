const usersData = require("../seed-data/users");
const productsData = require("../seed-data/products");
const sourcesData = require("../seed-data/sources");
const currentSearchData = require("../seed-data/current_searches");
exports.seed = function (knex) {
  return knex("sources")
    .del()
    .then(() => {
      return knex("current_searches")
        .del()
        .then(() => {
          return knex("products")
            .del()
            .then(() => {
              return knex("users").del();
            });
        });
    })

    .then(() => {
      return knex("users").insert(usersData);
    })
    .then(() => {
      return knex("products").insert(productsData);
    })
    .then(() => {
      return knex("sources").insert(sourcesData);
    })
    .then(() => {
      return knex("current_searches").insert(currentSearchData);
    });
};
