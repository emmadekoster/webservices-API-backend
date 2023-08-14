module.exports = {
  log: {
    level: "info",
    disabled: false,
  },
  cors: {
    origins: ["http://localhost:3000"],
    maxAge: 3 * 60 * 60,
  },
  database: {
    host: "vichogent.be",
    port: 40043,
    name: "186541ed",
    client: "mysql2",
  },
  port: 9000,
};
