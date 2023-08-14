module.exports = {
  seed: async (knex) => {
    // first delete all entries
    await knex("restaurants").delete();

    // then add the fresh places
    await knex("restaurants").insert([
      {
        id: 1,
        name: "Casita",
        street: "Gentsestraat",
        number: 7,
        zipCode: 9000,
        city: "Gent",
        owner_id: 1,
      },
      {
        id: 2,
        name: "Dios",
        street: "Dorpstraat",
        number: 45,
        zipCode: 9000,
        city: "Gent",
        owner_id: 1,
      },
      {
        id: 3,
        name: "Brunello's",
        street: "Brugse Steenweg",
        number: 15,
        zipCode: 8000,
        city: "Brugge",
        owner_id: 1,
      },
    ]);
  },
};
