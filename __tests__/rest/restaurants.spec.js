const { withServer } = require("../helpers");
const { tables } = require("../../src/data/index");
const config = require("config");

jest.mock("../../src/data/index"),
  () => ({
    tables: jest.fn(),
  });

const data = {
  restaurants: [
    {
      id: 1,
      name: "Carlos",
      street: "stationstraat",
      number: 34,
      zipCode: 9000,
      city: "Gent",
      owner_id: 1,
    },
    {
      id: 2,
      name: "Bruno's",
      street: "legeweg",
      number: 34,
      zipCode: 8000,
      city: "Brugge",
      owner_id: 1,
    },
    ,
    {
      id: 3,
      name: "Poke",
      street: "stationstraat",
      number: 2,
      zipCode: 9000,
      city: "Gent",
      owner_id: 2,
    },
    ,
  ],
  owners: [
    {
      id: 10,
      name: config.get("auth.testUser.username"),
      auth0id: config.get("auth.testUser.userId"),
    },
  ],
};

const dataToDelete = {
  restaurants: [1, 2, 3],
  owners: [10],
};

describe("Restaurants", () => {
  let request;
  let knex;
  let authHeader;

  withServer(({ knex: k, request: r }) => {
    knex = k;
    request = r;
    authHeader = a;
  });

  const url = "/api/restaurants";

  // test de get route van restaurants
  describe("GET /api/restaurants", () => {
    beforeAll(async () => {
      await knex(tables.owner).insert(data.owners);
      await knex(tables.restaurant).insert(data.restaurants);
    });

    afterAll(async () => {
      await knex(tables.restaurant)
        .whereIn("id", dataToDelete.restaurants)
        .delete();

      await knex(tables.owner).whereIn("id", dataToDelete.owners).delete();
    });

    test("it should 200 and return all restaurants", async () => {
      const response = await request.get(url).set("Authorization", authHeader);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(3);
    });

    //test de getbyid routes van restaurants
    describe("GET /api/restaurants/:id", () => {
      beforeAll(async () => {
        await knex(tables.owner).insert(data.owners);
        await knex(tables.restaurant).insert(data.restaurants[0]);
      });

      afterAll(async () => {
        await knex(tables.restaurant)
          .where("id", dataToDelete.restaurants[0])
          .delete();

        await knex(tables.owner).whereIn("id", dataToDelete.owners).delete();
      });

      test("it should 200 and return the requested restaurant", async () => {
        const restaurantId = data.restaurants[0].id;
        const response = await request
          .get(`${url}/${restaurantId}`)
          .set("Authorization", authHeader);

        expect(response.status).toBe(200);
        expect(response.body).toEqual({
          id: restaurantId,
          name: "Carlos",
          owner_id: 1,
          location: {
            street: "stationstraat",
            number: 34,
            zipCode: 9000,
            city: "Gent",
          },
        });
      });
    });

    // test de post route van restaurants
    describe("POST /api/restaurants", () => {
      const restaurantsToDelete = [];
      const ownersToDelete = [];

      beforeAll(async () => {
        await knex(tables.owner).insert(data.owners);
      });

      afterAll(async () => {
        await knex(tables.restaurant)
          .whereIn("id", restaurantsToDelete)
          .delete();

        await knex(tables.owner).whereIn("id", ownersToDelete).delete();
      });

      test("it should 201 and return the created transaction", async () => {
        const response = await request
          .post(url)
          .send({
            name: "Carlitos",
            street: "brugseweg",
            number: 5,
            zipCode: 8000,
            city: "Brugge",
          })
          .set("Authorization", authHeader);

        expect(response.status).toBe(201);
        expect(response.body.id).toBeTruthy();
        expect(response.body.name).toEqual("Carlitos");
        expect(response.body.street).toEqual("brugseweg");
        expect(response.body.number).toBe(5);
        expect(response.body.zipCode).toBe(8000);
        expect(response.body.city).toEqual("Brugge");

        restaurantsToDelete.push(response.body.id);
        ownersToDelete.push(response.body.user.id);

        // ...
      });
    });

    //test de put route van restaurants
    describe("PUT /api/restaurants/:id", () => {
      const ownersToDelete = [];

      beforeAll(async () => {
        await knex(tables.owner).insert(data.owners);
        await knex(tables.restaurant).insert([
          {
            name: "Carlitos",
            street: "brugseweg",
            number: 5,
            zipCode: 8000,
            city: "Brugge",
          },
        ]);
      });

      afterAll(async () => {
        await knex(tables.restaurant).where("id", 4).delete();
        await knex(tables.owner).whereIn("id", ownersToDelete).delete();
      });

      test("it should 200 and return the updated restaurant", async () => {
        const response = await request
          .put(`${url}/4`)
          .send({
            name: "Carlitos",
            street: "brugseweg",
            number: 5,
            zipCode: 8000,
            city: "Brugge",
          })
          .set("Authorization", authHeader);

        expect(response.status).toBe(201);
        expect(response.body.id).toBeTruthy();
        expect(response.body.name).toEqual("Carlitos");
        expect(response.body.street).toEqual("brugseweg");
        expect(response.body.number).toBe(5);
        expect(response.body.zipCode).toBe(8000);
        expect(response.body.city).toEqual("Brugge");

        ownersToDelete.push(response.body.user.id);
      });
    });

    //test de delete route van restaurants
    describe("DELETE /api/restaurants/:id", () => {
      beforeAll(async () => {
        await knex(tables.owner).insert(data.owners);
        await knex(tables.restaurant).insert([
          {
            name: "Carlitos",
            street: "brugseweg",
            number: 5,
            zipCode: 8000,
            city: "Brugge",
          },
        ]);
      });

      afterAll(async () => {
        await knex(tables.owner).whereIn("id", dataToDelete.owners).delete();
      });

      test("it should 204 and return nothing", async () => {
        const response = await request
          .delete(`${url}/4`)
          .set("Authorization", authHeader);
        expect(response.status).toBe(204);
        expect(response.body).toEqual({});
      });
    });
  });
});
