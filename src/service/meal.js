const { debug } = require("winston");
const { getLogger } = require("../core/logging");
const mealRepo = require("../repository/meal");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

const getMeal = async () => {
  const meal = await mealRepo.getMeal();
  return meal;
};

const getById = async (id) => {
  debugLog(`Fetching meal with id ${id}`);
  const meal = await mealRepo.getById(id);

  if (!meal) {
    throw ServiceError.notFound(`There is no meal with id ${id}`, {
      id,
    });
  }
  return meal;
};

const create = async ({
  name,
  price,
  numberOfCalories,
  dietRestrictions,
  gramsOfProtein,
  typeOfMeal,
  restaurant_id,
}) => {
  const newMeal = await mealRepo.create({
    name,
    price,
    numberOfCalories,
    dietRestrictions,
    gramsOfProtein,
    typeOfMeal,
    restaurant_id,
  });
  debugLog("Creating new meal", newMeal);
  return newMeal;
};

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
  const updatedMeal = {
    name,
    price,
    numberOfCalories,
    dietRestrictions,
    gramsOfProtein,
    typeOfMeal,
    restaurant_id,
  };
  debugLog(`Updating meal with id ${id}`, updatedMeal);
  await mealRepo.updateById(id, updatedMeal);
  return getById(id);
};

const deleteById = async (id) => {
  debugLog(`Deleting meal with id ${id}`);
  await mealRepo.deleteById(id);
};

module.exports = {
  getMeal,
  getById,
  create,
  updateById,
  deleteById,
};
