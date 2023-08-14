const { tables } = require("../index");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.restaurant, (table) => {
      table.increments("id");
      table.string("name", 255).notNullable();
      table.string("street", 255).notNullable();
      table.integer("number").unsigned().notNullable();
      table.integer("zipCode").unsigned().notNullable();
      table.string("city", 255).notNullable();
      table.integer("owner_id").unsigned().notNullable();
    });
  },
  down: (knex) => {
    return knex.schema.dropTableIfExists(tables.restaurant);
  },
};
