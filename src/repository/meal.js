const Meal = require("./models/Meal");
const { getLogger } = require("../core/logging");

//get alle gerechten die aan de opgegeven voorwaarden voldoen
const getMeal = async () => {
  const meals = await Meal.query().where({
    price: 20,
    numberOfCalories: 550,
    dietRestrictions: "none",
    gramsOfProtein: 30,
    typeOfMeal: "lunch",
  });
  return meals.map((m) => formatMeal(m));
};

//get een specifiek gerecht volgens zijn ID uit de database
const getById = async (id) => {
  const meal = await Meal.query().findById(id);
  return meal && formatMeal(meal);
  //formatteert pas als er een meal gevonden is
};

//voeg een nieuw gerecht toe in de database voor een bepaald restaurant
const create = async ({
  name,
  price,
  numberOfCalories,
  dietRestrictions,
  gramsOfProtein,
  typeOfMeal,
  restaurant_id,
}) => {
  try {
    const newMeal = await Meal.query().insert({
      name: name,
      price: price,
      numberOfCalories: numberOfCalories,
      dietRestrictions: dietRestrictions,
      gramsOfProtein: gramsOfProtein,
      typeOfMeal: typeOfMeal,
      restaurant_id: restaurant_id,
    });
  } catch (error) {
    getLogger().error("Error in creating a new meal", { error });
    throw error;
  }
};

//update een bestaand gerecht adhv zijn ID
const updateById = async (
  id,
  {
    name,
    price,
    numberOfCalories,
    dietRestrictions,
    gramsOfProtein,
    typeOfMeal,
    restaurant_id,
  }
) => {
  try {
    const updatedMeal = await Meal.query().findById(id).patch({
      name: name,
      price: price,
      numberOfCalories: numberOfCalories,
      dietRestrictions: dietRestrictions,
      gramsOfProtein: gramsOfProtein,
      typeOfMeal: typeOfMeal,
      restaurant_id: restaurant_id,
    });
  } catch (error) {
    getLogger().error("Update meal failed", { error });
    throw error;
  }
};

//delete een bepaald gerecht uit de database adhv zijn ID
const deleteById = async (id) => {
  try {
    const rowsAffected = await Meal.query().deleteById(id);
    return rowsAffected > 0;
  } catch (error) {
    getLogger().error("Delete meal failed", { error });
    throw error;
  }
};

module.exports = {
  getMeal,
  getById,
  create,
  updateById,
  deleteById,
};

const formatMeal = ({ restaurant_id, ...rest }) => ({
  ...rest,
  restaurant: {
    id: restaurant_id,
  },
});
