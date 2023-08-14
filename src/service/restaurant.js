const { getLogger } = require("../core/logging");
const restaurantRepo = require("../repository/restaurant");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

// get All restaurants voor een opgegeven stad
const getAll = async () => {
  debugLog("Fetching all restaurants");
  const restaurants = await restaurantRepo.getAll();
  return {
    items: restaurants,
  };
};

//get restaurant voor opgegeven ID
const getById = async (id) => {
  debugLog(`Fetching restaurant with id ${id}`);
  const restaurant = await restaurantRepo.getById(id);

  if (!restaurant) {
    throw ServiceError.notFound(`There is no restaurant with id ${id}`, {
      id,
    });
  }

  return restaurant;
};

const create = async ({ name, street, number, zipCode, city, owner_id }) => {
  debugLog("Creating new restaurant");
  const newRestaurant = await restaurantRepo.create({
    name,
    street,
    number,
    zipCode,
    city,
    owner_id,
  });
};

const updateById = async (
  id,
  { name, street, number, zipCode, city, owner_id }
) => {
  debugLog(`Updating restaurant with id ${id}`, {
    name,
    street,
    number,
    zipCode,
    city,
    owner_id,
  });

  const updatedRestaurant = await restaurantRepo.updateById(id, {
    name,
    street,
    number,
    zipCode,
    city,
    owner_id,
  });

  return updatedRestaurant;
};

const deleteById = async (id) => {
  debugLog(`Deleting restaurant with id ${id}`);
  const deletedRestaurant = await restaurantRepo.deleteById(id);
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};
