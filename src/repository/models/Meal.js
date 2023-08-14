"use strict";

const { Model } = require("objection");

class Meal extends Model {
  // Table name is the only required property.
  static get tableName() {
    return "meals";
  }

  // Optional JSON schema. This is not the database schema! Nothing is generated
  // based on this. This is only used for validation. Whenever a model instance
  // is created it is checked against this schema. http://json-schema.org/.

  static get jsonSchema() {
    return {
      type: "object",
      required: ["name"],

      properties: {
        id: { type: "integer" },
        name: { type: "string", minLength: 1, maxLength: 255 },
        price: { type: "integer" },
        numberOfCalories: { type: "integer" },
        dietRestrictions: { type: "string", minLength: 1, maxLength: 255 },
        gramsOfProtein: { type: "integer" },
        typeOfMeal: { type: "string", minLength: 1, maxLength: 255 },
        restaurant_id: { type: "integer" },
      },
    };
  }

  // This object defines the relations to other models.
  static get relationMappings() {
    // One way to prevent circular references
    // is to require the model classes here.
    const Restaurant = require("./Restaurant");

    return {
      restaurant: {
        relation: Model.BelongsToOneRelation,

        // The related model. This can be either a Model subclass constructor or an
        // absolute file path to a module that exports one.
        modelClass: Restaurant,

        join: {
          from: "meals.restaurant_id",
          to: "restaurant.id",
        },
      },
    };
  }
}

module.exports = Meal;
