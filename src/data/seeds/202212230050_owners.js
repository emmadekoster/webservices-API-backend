module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex("owners").delete();

    // then add the fresh places
    await knex("owners").insert([
      {
        id: 1,
        name: "Emma De Koster",
        auth0id: "0",
      },
    ]);
  },
};
