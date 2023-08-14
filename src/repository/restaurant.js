const Restaurant = require("./models/Restaurant");
const { getLogger } = require("../core/logging");

//get all restaurants voor opgegeven stad
const getAll = async (city) => {
  const restaurants = await Restaurant.query().where({
    city: "Gent",
  });
  return restaurants.map((r) => formatRestaurant(r));
};

//get specifiek restaurant met bepaalde ID
const getById = async (id) => {
  const restaurant = await Restaurant.query().findById(id);
  return restaurant && formatRestaurant(restaurant);
  //alleen als er een restaurant gevonden is word de formatfunctie opgeroepen
};

//voeg nieuw restaurant toe aan database
const create = async ({ name, street, number, zipCode, city, owner_id }) => {
  try {
    const newRestaurant = await Restaurant.query().insert({
      name: name,
      street: street,
      number: number,
      zipCode: zipCode,
      city: city,
      owner_id: owner_id,
    });
  } catch (error) {
    getLogger().error("Error in creating a new restaurant", { error });
    throw error;
  }
};

//update een bestaand restaurant adhv zijn ID
const updateById = async (
  id,
  { name, street, number, zipCode, city, owner_id }
) => {
  try {
    const updatedRestaurant = await Restaurant.query().findById(id).patch({
      name: name,
      street: street,
      number: number,
      zipCode: zipCode,
      city: city,
      owner_id: owner_id,
    });
  } catch (error) {
    getLogger().error("Update restaurant failed", { error });
    throw error;
  }
};

//delete een restaurant uit de database adhv zijn ID
const deleteById = async (id) => {
  try {
    const deletedRestaurant = await Restaurant.query().deleteById(id);
  } catch (error) {
    getLogger().error("Delete restaurant failed", { error });
    throw error;
  }
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
};

//weet niet of dit hier nog nuttig is om te doen (waarschijnlijk niet)!!!
const formatRestaurant = ({ street, number, zipCode, city, ...rest }) => ({
  ...rest,
  location: { street, number, zipCode, city },
});
