const { getLogger } = require("../core/logging");
const ownerRepo = require("../repository/owner");
const ServiceError = require("../core/serviceError");

const debugLog = (message, meta = {}) => {
  if (!this.logger) this.logger = getLogger();
  this.logger.debug(message, meta);
};

// get All restaurants voor een opgegeven stad
const getAll = async () => {
  debugLog("Fetching all owners");
  const owners = await ownerRepo.getAll();
  return {
    items: owners,
  };
};

//get restaurant voor opgegeven ID
const getById = async (id) => {
  debugLog(`Fetching owner with id ${id}`);
  const owner = await ownerRepo.getById(id);

  if (!owner) {
    throw ServiceError.notFound(`There is no owner with id ${id}`, {
      id,
    });
  }

  return owner;
};

const create = async ({ name, auth0id }) => {
  debugLog("Creating new owner");
  const newOwner = await ownerRepo.create({
    name,
    auth0id,
  });
  return newOwner;
};

const updateById = async (id, { name, auth0id }) => {
  debugLog(`Updating restaurant with id ${id}`, {
    name,
    auth0id,
  });

  const updatedOwner = await ownerRepo.updateById(id, {
    name,
    auth0id,
  });

  return updatedOwner;
};

const deleteById = async (id) => {
  debugLog(`Deleting owner with id ${id}`);
  const deletedOwner = await ownerRepo.deleteById(id);
};

//extra functie voor auth
const getByAuth0Id = async (auth0id) => {
  debugLog(`Fetching owner with auth0id ${auth0id}`);
  const owner = await ownerRepo.findByAuth0Id(auth0id);

  if (!owner) {
    throw ServiceError.notFound(`No owner with id ${auth0id} exists`, {
      auth0id,
    });
  }

  return owner;
};

module.exports = {
  getAll,
  getById,
  create,
  updateById,
  deleteById,
  getByAuth0Id,
};
