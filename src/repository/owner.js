const Owner = require("./models/Owner");
const { getLogger } = require("../core/logging");

//get all owners
const getAll = async () => {
  const owners = await Owner.query();
  return owners;
};

//get specifieke owner
const getById = async (id) => {
  const owner = await Owner.query().findById(id);
  return owner;
};

//voeg nieuwe owner toe aan database
const create = async ({ name, auth0id }) => {
  try {
    const newOwner = await Owner.query().insert({
      name: name,
      auth0id: auth0id,
    });
  } catch (error) {
    getLogger().error("Error in creating a new owner", { error });
    throw error;
  }
};

//update een bestaand restaurant adhv zijn ID
const updateById = async (id, { name, auth0id }) => {
  try {
    const updatedOwner = await Owner.query().findById(id).patch({
      name: name,
      auth0id: auth0id,
    });
  } catch (error) {
    getLogger().error("Update owner failed", { error });
    throw error;
  }
};

//delete een restaurant uit de database adhv zijn ID
const deleteById = async (id) => {
  try {
    const deletedOwner = await Owner.query().deleteById(id);
  } catch (error) {
    getLogger().error("Delete owner failed", { error });
    throw error;
  }
};

// extra functie voor auth
const findByAuth0Id = async (auth0id) => {
  return await getKnex()(tables.owner).where("auth0id", auth0id).first();
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  findByAuth0Id,
};
