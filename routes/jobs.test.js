"use strict";

const request = require("supertest");

const db = require("../db");
const app = require("../app");

const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
  u1Token,
  adminToken
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** POST /jobs */

describe("POST /jobs", function () {
  const newJob = {
    title: "j4",
    salary: 40,
    equity: 0.4,
    company_handle: "c1"
  };

  test("works for admins", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${adminToken}`);

    expect(resp.statusCode).toEqual(201);
    expect(resp.body).toEqual(
      {
        job: {
          "companyHandle": "c1",
          "equity": "0.4",
          "id": expect.any(Number),
          "salary": 40,
          "title": "j4",
        }
      });
  });

  test("unauth for users", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${u1Token}`);

    expect(resp.statusCode).toEqual(401);
  });

  test("unauth for anon", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send(newJob);

    expect(resp.statusCode).toEqual(401);
  });

  test("bad request with missing data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: "new job",
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });

  test("bad request with invalid data", async function () {
    const resp = await request(app)
      .post("/jobs")
      .send({
        title: 19129,
      })
      .set("authorization", `Bearer ${adminToken}`);
    expect(resp.statusCode).toEqual(400);
  });
});


/************************************** GET /jobs */

describe("GET /jobs", function () {

  test("ok for anon", async function () {
    const resp = await request(app).get("/jobs");
    expect(resp.body).toEqual({
      jobs:
        [
          {
            "companyHandle": "c1",
            "equity": "0.1",
            "id": expect.any(Number),
            "salary": 10,
            "title": "j1",

          },
          {
            "companyHandle": "c2",
            "equity": "0.2",
            "id": expect.any(Number),
            "salary": 20,
            "title": "j2",
          },
          {
            "companyHandle": "c3",
            "equity": "0.3",
            "id": expect.any(Number),
            "salary": 30,
            "title": "j3",

          },
        ],
    });
  });

  //insert filtering tests here when implemented

});

/************************************** GET /jobs/:id */

describe("GET /jobs/:id", function () {
  const newJob = {
    title: "j4",
    salary: 40,
    equity: 0.4,
    company_handle: "c1"
  };

  test("works for anon", async function () {
    const respNew = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${adminToken}`);

    const id = await respNew.body.job.id;

    const resp = await request(app).get(`/jobs/${id}`);
    expect(resp.body).toEqual(
      {
        job: {
          id: id,
          title: "j4",
          salary: 40,
          equity: "0.4",
          companyHandle: "c1"
        }
      });
  });

  test("not found for no such job", async function () {
    const resp = await request(app).get(`/jobs/9999`);
    expect(resp.statusCode).toEqual(404);
  });
});

/************************************** PATCH /jobs/:id */

describe("PATCH /jobs/:id", function () {
  const newJob = {
    title: "j4",
    salary: 40,
    equity: 0.4,
    company_handle: "c1"
  };

  test("works for admins", async function () {
    const respNew = await request(app)
      .post("/jobs")
      .send(newJob)
      .set("authorization", `Bearer ${adminToken}`);

    const id = await respNew.body.job.id;
    console.log("##############job id in works for admin test", id)
    console.log("##############typeof id", typeof id)

    const resp = await request(app)
      .patch(`/jobs/${id}`)
      .send({
        title: "NEW TITLE"
      })
      .set("authorization", `Bearer ${adminToken}`)

      expect(resp.statusCode).toEqual(200);
      expect(resp.body).toEqual(
        {
          job: {
            id: expect.any(Number),
            title: "NEW TITLE",
            salary: 40,
            equity: "0.4",
            companyHandle: "c1"
          }
        });
  });
})

