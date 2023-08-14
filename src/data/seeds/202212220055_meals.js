module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex("meals").delete();

    // then add the fresh places
    await knex("meals").insert([
      {
        id: 1,
        name: "Kip tikka massala",
        price: 20,
        numberOfCalories: 550,
        dietRestrictions: "none",
        gramsOfProtein: 30,
        typeOfMeal: "lunch",
        restaurant_id: 2,
      },
      {
        id: 2,
        name: "Acai bowl",
        price: 10,
        numberOfCalories: 300,
        dietRestrictions: "vegan",
        gramsOfProtein: 15,
        typeOfMeal: "breakfast",
        restaurant_id: 1,
      },
      {
        id: 3,
        name: "Protein oats",
        price: 15,
        numberOfCalories: 350,
        dietRestrictions: "vegan",
        gramsOfProtein: 30,
        typeOfMeal: "breakfast",
        restaurant_id: 1,
      },
      {
        id: 4,
        name: "Veggie Spaghetti",
        price: 18,
        numberOfCalories: 550,
        dietRestrictions: "veggie",
        gramsOfProtein: 20,
        typeOfMeal: "diner",
        restaurant_id: 3,
      },
    ]);
  },
};
