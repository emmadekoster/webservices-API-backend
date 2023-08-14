const Router = require("@koa/router");
const ownerService = require("../service/owner");
const config = require("config");
const { hasPermission, permissions } = require("../core/auth");

const getALlOwners = async (ctx) => {
  ctx.body = await ownerService.getAll(ctx.request.body);
};

const createOwner = async (ctx) => {
  const newOwner = await ownerService.create({
    ...ctx.request.body,
  });
  ctx.body = newOwner;
};

const getOwnerById = async (ctx) => {
  ctx.body = await ownerService.getById(ctx.params.id);
};

const updateOwnerById = async (ctx) => {
  ctx.body = await ownerService.updateById(ctx.params.id, ctx.request.body);
};

const deleteOwner = async (ctx) => {
  await ownerService.deleteById(ctx.params.id);
  ctx.status = 204;
};

module.exports = (app) => {
  const router = new Router({
    prefix: "/owners",
  });

  router.get("/", hasPermission(permissions.loggedIn), getALlOwners);
  router.post("/", hasPermission(permissions.write), createOwner);
  router.get("/:id", hasPermission(permissions.read), getOwnerById);
  router.put("/:id", hasPermission(permissions.write), updateOwnerById);
  router.delete("/:id", hasPermission(permissions.write), deleteOwner);

  app.use(router.routes()).use(router.allowedMethods());
};
