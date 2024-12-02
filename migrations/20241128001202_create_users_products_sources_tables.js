/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable("users", (table) => {
      table.increments("user_id").primary().notNullable();
      table.string("sessionId").notNullable();
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("products", (table) => {
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
      table.increments("id").primary();
      table.string("name", 1000).notNullable();
      table.integer("source_score").notNullable().defaultTo(0);
      table
        .integer("product_id")
        .unsigned()
        .references("products.id")
        .onUpdate("CASCADE")
        .onDelete("CASCADE");
      table.timestamp("created_at").defaultTo(knex.fn.now());
      table
        .timestamp("updated_at")
        .defaultTo(knex.raw("CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"));
    })
    .createTable("current_searches", (table) => {
      table.increments("id").primary();
      table.string("current_search", 1000).notNullable();
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
