/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      // USER

      table.increments("user_id").primary().notNullable();
      table.string("sessionId").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("products", (table) => {
      // PRODUCTS
      table.increments("id").primary();
      table.string("name", 1000).notNullable();
      table.integer("preference_score").notNullable().defaultTo(0);
      table
        .integer("user_id")
        .unsigned()
        .references("users.user_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("sources", (table) => {
      // SOURCES
      table.increments("id").primary();
      table.string("name", 1000).notNullable();
      table.integer("source_score").notNullable().defaultTo(0);
      table
        .integer("product_id")
        .unsigned()
        .references("products.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table
        .integer("user_id")
        .unsigned()
        .references("users.user_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("current_searches", (table) => {
      // CURRENT_SEARCHES
      table.increments("id").primary();
      table.string("current_search", 1000).notNullable();
      table.string("search_id", 1000).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.user_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("saved_products", (table) => {
      // SAVED PRODUCTS
      table.increments("id").primary();
      table.string("searchOrigin", 1000).notNullable();
      table.string("title", 1000).notNullable();
      table.string("link", 1000).notNullable();
      table.string("source", 1000).notNullable();
      table.string("source_logo", 1000).notNullable();
      table.string("price", 1000).notNullable();
      table.string("rating", 1000).notNullable();
      table.string("reviews", 1000).notNullable();
      table.string("image", 1000).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.user_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("liked_products", (table) => {
      // LIKED PRODUCTS
      table.increments("id").primary();
      table.string("searchOrigin", 1000).notNullable();
      table.string("title", 1000).notNullable();
      table.string("link", 1000).notNullable();
      table.string("source", 1000).notNullable();
      table.string("source_logo", 1000).notNullable();
      table.string("price", 1000).notNullable();
      table.string("rating", 1000).notNullable();
      table.string("reviews", 1000).notNullable();
      table.string("image", 1000).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.user_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("history_products", (table) => {
      // HISTORY PRODUCTS
      table.increments("id").primary();
      table.string("searchOrigin", 1000).notNullable();
      table.string("title", 1000).notNullable();
      table.string("link", 1000).notNullable();
      table.string("source", 1000).notNullable();
      table.string("source_logo", 1000).notNullable();
      table.string("price", 1000).notNullable();
      table.string("rating", 1000).notNullable();
      table.string("reviews", 1000).notNullable();
      table.string("image", 1000).notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.user_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("personalized_searches", (table) => {
      // PERSONALIZED SEARCHES
      table
        .increments("id")
        .primary()
        .table.string("search_name", 1000)
        .notNullable();
      table
        .integer("user_id")
        .unsigned()
        .references("users.user_id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTable("sources")
    .dropTable("products")
    .dropTable("users");
};
