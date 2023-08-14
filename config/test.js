module.exports = {
  log: {
    level: "silly",
    disabled: true,
  },
  cors: {
    origins: ["http://localhost:3000"],
    maxAge: 3 * 60 * 60,
  },
  database: {
    client: "mysql2",
    host: "vichogent.be",
    port: 40043,
    name: "186541ed_test",
  },
  port: 9000,
};
