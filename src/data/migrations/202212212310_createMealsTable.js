const { tables } = require("../index");

module.exports = {
  up: async (knex) => {
    await knex.schema.createTable(tables.meal, (table) => {
      table.increments("id");
      table.string("name").notNullable();
      table.integer("price").unsigned().notNullable();
      table.integer("numberOfCalories").unsigned().notNullable();
      table.string("dietRestrictions").notNullable();
      table.integer("gramsOfProtein").unsigned().notNullable();
      table.string("typeOfMeal").notNullable();
      table.integer("restaurant_id").unsigned().notNullable();

      table.unique("name", "idx_place_name_unique");

      table
        .foreign("restaurant_id", "fk_meal_restaurant")
        .references(`${tables.restaurant}.id`)
        .onDelete("CASCADE"); // CSC= als ik een restaurant verwijder, gaat db automatisch alle meals gelinkt ah restaurant ook verwijderen
    });
  },
  down: (knex) => {
    knex.schema.dropTableIfExists(tables.meal);
  },
};
