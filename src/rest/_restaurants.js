const Router = require("@koa/router");
const restaurantService = require("../service/restaurant");
const ownerService = require("../service/owner");
const { getKnex } = require("../data/index");
const Joi = require("joi");
const validate = require("./_validation");
const { hasPermission, permissions } = require("../core/auth");
const config = require("config");

const getAllRestaurants = async (ctx) => {
  ctx.body = await restaurantService.getAll();
};
getAllRestaurants.validationScheme = {
  query: Joi.object({
    limit: Joi.number().positive().max(1000).optional(),
    offset: Joi.number().min(0).optional(),
  }).and("limit", "offset"),
};

const createRestaurants = async (ctx) => {
  const newRestaurant = await restaurantService.create({
    ...ctx.request.body,
  });
  ctx.body = newRestaurant;
};
createRestaurants.validationScheme = {
  body: {
    name: Joi.string(),
    street: Joi.string(),
    number: Joi.number().integer().positive(),
    zipCode: Joi.number().integer().positive(),
    city: Joi.string(),
    owner_id: Joi.number().integer(),
  },
};

const getRestaurantById = async (ctx) => {
  ctx.body = await restaurantService.getById(ctx.params.id);
  // we moeten hier dus wachten tot we het resultaat van de servicelaag krijgen
};
getRestaurantById.validationScheme = {
  params: Joi.object({
    id: Joi.number().integer().positive(),
  }),
};

const updateRestaurant = async (ctx) => {
  ctx.body = await restaurantService.updateById(ctx.params.id, {
    ...ctx.request.body,
  });
};
updateRestaurant.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
  body: {
    name: Joi.string(),
    street: Joi.string(),
    number: Joi.number().integer().positive(),
    zipCode: Joi.number().integer().positive(),
    city: Joi.string(),
    owner_id: Joi.number().integer(),
  },
};

const deleteRestaurant = async (ctx) => {
  await restaurantService.deleteById(ctx.params.id);
  ctx.status = 204;
};
deleteRestaurant.validationScheme = {
  params: {
    id: Joi.number().integer().positive(),
  },
};

/**
 * Install transaction routes in the given router.
 *
 * @param {Router} app - The parent router.
 */
module.exports = (app) => {
  const router = new Router({
    prefix: "/restaurants",
  });

  router.get(
    "/",
    hasPermission(permissions.loggedIn),
    validate(getAllRestaurants.validationScheme),
    getAllRestaurants
  );
  router.post(
    "/",
    hasPermission(permissions.write),
    validate(createRestaurants.validationScheme),
    createRestaurants
  );
  router.get(
    "/:id",
    hasPermission(permissions.read),
    validate(getRestaurantById.validationScheme),
    getRestaurantById
  );
  router.put(
    "/:id",
    hasPermission(permissions.write),
    validate(updateRestaurant.validationScheme),
    updateRestaurant
  );
  router.delete(
    "/:id",
    hasPermission(permissions.write),
    validate(deleteRestaurant.validationScheme),
    deleteRestaurant
  );

  app.use(router.routes()).use(router.allowedMethods());
};
