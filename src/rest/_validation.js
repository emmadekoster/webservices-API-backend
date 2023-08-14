const Joi = require("joi");

const JOI_OPTIONS = {
  abortEarly: true,
  allowUnknown: false,
  context: true,
  convert: true,
  presence: "required",
};

const cleanupJoiError = (error) =>
  error.details.reduce((resultObj, { message, path, type }) => {
    const joinedPath = path.join(".") || "value";
    if (!resultObj[joinedPath]) {
      resultObj[joinedPath] = [];
    }
    resultObj[joinedPath].push({
      type,
      message,
    });

    return resultObj;
  }, {});

const validate = (schema) => {
  if (!schema) {
    schema = {
      query: {},
      body: {},
      params: {},
    };
  }

  return (ctx, next) => {
    const errors = {};
    //voor parameters; voor routes die met id werken meestal
    if (!Joi.isSchema(schema.params)) {
      schema.params = Joi.object(schema.params || {});
    }

    const { error: paramsError, value: paramsValue } = schema.params.validate(
      ctx.params,
      JOI_OPTIONS
    );

    if (paramsError) {
      errors.params = cleanupJoiError(paramsError);
    } else {
      ctx.params = paramsValue;
    }

    //voor body (zoals post en put methodes)
    if (!Joi.isSchema(schema.body)) {
      schema.body = Joi.object(schema.body || {});
    }

    const { error: bodyError, value: bodyValue } = schema.body.validate(
      ctx.request.body,
      JOI_OPTIONS
    );

    if (bodyError) {
      errors.body = cleanupJoiError(bodyError);
    } else {
      ctx.request.body = bodyValue;
    }

    //voor query (getAll methode)
    if (schema.query) {
      if (!Joi.isSchema(schema.query)) {
        schema.query = Joi.object(schema.query);
      }

      const { error: queryErrors, value: queryValue } = schema.query.validate(
        ctx.query,
        JOI_OPTIONS
      );

      if (queryErrors) {
        errors.query = cleanupJoiError(queryErrors);
      } else {
        ctx.query = queryValue;
      }
    }

    if (Object.keys(errors).length) {
      ctx.throw(400, "Validation failed, check details for more information", {
        code: "VALIDATION_FAILED",
        details: errors,
      });
    }

    return next();
  };
};

module.exports = validate;
