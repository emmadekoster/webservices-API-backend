const Router = require("@koa/router");
const mealService = require("../service/meal");
const config = require("config");
const { hasPermission, permissions } = require("../core/auth");

const getMeal = async (ctx) => {
  ctx.body = await mealService.getMeal(ctx.request.body);
};

const createMeal = async (ctx) => {
  const newMeal = await mealService.create({
    ...ctx.request.body,
  });
  ctx.body = newMeal;
};

const getMealById = async (ctx) => {
  ctx.body = await mealService.getById(ctx.params.id);
};

const updatedMeal = async (ctx) => {
  ctx.body = await mealService.updateById(ctx.params.id, ctx.request.body);
};

const deleteMeal = async (ctx) => {
  await mealService.deleteById(ctx.params.id);
  ctx.status = 204;
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/meals",
  });

  router.get("/", hasPermission(permissions.loggedIn), getMeal);
  router.post("/", hasPermission(permissions.write), createMeal);
  router.get("/:id", hasPermission(permissions.loggedIn), getMealById);
  router.put("/:id", hasPermission(permissions.write), updatedMeal);
  router.delete("/:id", hasPermission(permissions.write), deleteMeal);

  app.use(router.routes()).use(router.allowedMethods());
};
