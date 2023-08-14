const config = require("config");
const objection = require("objection");
const { Model } = require("objection");
const knex = require("knex");
const { getLogger } = require("../core/logging");
const path = require("path");
const ServiceError = require("../core/serviceError");

const NODE_ENV = config.get("env");
const isDevelopment = NODE_ENV === "development";

const DATABASE_CLIENT = config.get("database.client");
const DATABASE_NAME = config.get("database.name");
const DATABASE_HOST = config.get("database.host");
const DATABASE_PORT = config.get("database.port");
const DATABASE_USERNAME = config.get("database.username");
const DATABASE_PASSWORD = config.get("database.password");

let knexInstance;

const knexLogger = (logger, level) => (message) => {
  if (message.sql) {
    logger.log(level, message.sql);
  } else {
    logger.log(level, JSON.stringify(message));
  }
};

// connectie met db, migreren, seeding
async function initializeData() {
  const logger = getLogger();
  const knexOptions = {
    client: DATABASE_CLIENT,
    connection: {
      host: DATABASE_HOST,
      port: DATABASE_PORT,
      user: DATABASE_USERNAME,
      password: DATABASE_PASSWORD,
      insecureAuth: isDevelopment,
    },
    debug: isDevelopment,
    log: {
      debug: knexLogger(logger, "debug"),
      warn: knexLogger(logger, "warn"),
      error: knexLogger(logger, "error"),
    },
    migrations: {
      tableName: "knex_meta",
      directory: path.join("src", "data", "migrations"),
    },
    seeds: {
      directory: path.join("src", "data", "seeds"),
    },
  };

  knexInstance = knex(knexOptions);

  //even testen op connectie + migrations door uitvoeren query
  try {
    await knexInstance.raw("SELECT 1+1 AS result");
    await knexInstance.raw(`CREATE DATABASE IF NOT EXISTS ${DATABASE_NAME}`);

    //connectie verwijderen want we moeten Knex-configuratie updaten en reconnecten
    await knexInstance.destroy();
    knexOptions.connection.database = DATABASE_NAME;
    knexInstance = knex(knexOptions);
    await knexInstance.raw("SELECT 1+1 AS result");
  } catch (error) {
    logger.error(error.message, { error });
    throw ServiceError.notFound(`Couldn't initialize database`);
  }

  Model.knex(knexInstance);

  let knexMigrationFailed = true;
  try {
    await knexInstance.migrate.latest();
    knexMigrationFailed = false;
  } catch (error) {
    logger.error("Error while migrating the database", {
      error,
    });
  }

  // als er iets gefaald is gaan we terugschroeven naar voor laatste migratie
  if (knexMigrationFailed) {
    try {
      await knexInstance.migrate.down();
    } catch (error) {
      logger.error("Error while undoing last migration", { error });
    }
    throw ServiceError.notFound("Migration failed");
  }

  // Run seeds in development
  if (isDevelopment) {
    try {
      await knexInstance.seed.run();
    } catch (error) {
      logger.error("Error while seeding database", { error });
    }
  }

  logger.info("Succesfully connected to the database");

  return knexInstance;
}

async function shutdownData() {
  const logger = getLogger();

  logger.info("Shutting down database connection");

  await knexInstance.destroy();
  knexInstance = null;

  logger.info("Database connection closed");
}

//getter voor knex-instantie
function getKnex() {
  if (!knexInstance)
    throw ServiceError.notFound(
      "Please initialize the data layer before getting the Knex instance"
    );
  return knexInstance;
}

// constant object met namen van onze tabellen
// enkel gebruikt voor migrations WANT alles et objection.js gedaan idpv knex.js
const tables = Object.freeze({
  //deze komt bvb overeen met transaction tabel in db
  restaurant: "restaurants",
  meal: "meals",
  owner: "owners",
});

module.exports = {
  initializeData,
  tables,
  knexInstance,
  getKnex,
  shutdownData,
};
