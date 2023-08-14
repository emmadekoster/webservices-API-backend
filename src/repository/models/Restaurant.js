"use strict";

const { Model } = require("objection");

class Restaurant extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "restaurants";
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.

  // ben er nog niet volledig uit hoe die location gedaan moet worden!!
  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        location: {
          type: "object",
          properties: {
            street: { type: "string" },
            number: { type: "integer" },
            zipCode: { type: "integer" },
            city: { type: "string" },
          },
        },
        owner_id: { type: "integer" },
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // One way to prevent circular references
    // is to require the model classes here.
    const Meal = require("./Meal");
    const Owner = require("./Owner");

    return {
      dishes: {
        relation: Model.HasManyRelation,

        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Meal,

        join: {
          from: "restaurants.id",
          to: "meals.restaurant_id",
        },
      },

      owners: {
        relation: Model.HasOneRelation,

        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Owner,

        join: {
          from: "restaurants.owner_id",
          to: "owners.id",
        },
      },
    };
  }
}

module.exports = Restaurant;
