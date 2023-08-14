const Router = require("@koa/router");
const installRestaurantRouter = require("./_restaurants");
const installMealRouter = require("./_meal");
const installOwnerRouter = require("./_owner");
const installHealthRouter = require("./_health");

module.exports = (app) => {
  const router = new Router({ prefix: "/api" });

  installHealthRouter(router);
  installRestaurantRouter(router);
  installMealRouter(router);
  installOwnerRouter(router);

  app.use(router.routes()).use(router.allowedMethods());
};
