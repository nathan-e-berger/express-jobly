"use strict";

const db = require("../db.js");
const { BadRequestError, NotFoundError } = require("../expressError");
const Job = require("./job.js");
const {
  commonBeforeAll,
  commonBeforeEach,
  commonAfterEach,
  commonAfterAll,
} = require("./_testCommon");

beforeAll(commonBeforeAll);
beforeEach(commonBeforeEach);
afterEach(commonAfterEach);
afterAll(commonAfterAll);


/************************************** create */
describe("create", function () {
  const newJob = {
    "title": "new",
    "salary": 10,
    "equity": 0.001,
    "company_handle": 'c1'
  };

  test("create works", async function () {
    let job = await Job.create(newJob);
    expect(job).toEqual({
      "id": expect.any(Number),
      "title": "new",
      "salary": 10,
      "equity": "0.001",
      "companyHandle": 'c1'
    });

    const result = await db.query(
      `SELECT title, salary, equity, company_handle
          FROM jobs
          WHERE title = 'new'`);
    expect(result.rows).toEqual([
      {
        "title": "new",
        "salary": 10,
        "equity": "0.001",
        "company_handle": 'c1'
      }
    ]);
  });
});

/************************************** findAll */

describe("findAll", function () {
  test("works: no filter", async function () {
    let jobs = await Job.findAll();
    expect(jobs).toEqual([
      {
        "companyHandle": "c1",
        "equity": "0.001",
        "id": expect.any(Number),
        "salary": 10,
        "title": "j1",
      },
      {
        "companyHandle": "c2",
        "equity": "0.001",
        "id": expect.any(Number),
        "salary": 10,
        "title": "j2",
      },
      {
        "companyHandle": "c3",
        "equity": "0.001",
        "id": expect.any(Number),
        "salary": 10,
        "title": "j3",
      },
    ]);
  });
});

/************************************** get */

describe("get", function () {
  test("works with id 1", async function () {
    let job = await Job.get(1);
    expect(job).toEqual({
      "companyHandle": "c1",
      "equity": "0.001",
      "id": 1,
      "salary": 10,
      "title": "j1",
    });
  });

  test("not found if no such job id", async function () {
    try {
      await Job.get(9999999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

/************************************** update */

describe("update", function () {
  const updateData = {
    "title": "Updated Title",
    "salary": 99,
    "equity": 0.5
  };

  test("works", async function () {
    let job = await Job.update(1, updateData);

    expect(job).toEqual({
      "id": 1,
      "title": "Updated Title",
      "salary": 99,
      "equity": "0.5",
      "companyHandle": "c1",
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE id = 1`);

    expect(result.rows).toEqual([{
      "company_handle": "c1",
      "equity": "0.5",
      "id": 1,
      "salary": 99,
      "title": "Updated Title",
    }]);
  });

  test("works: null fields", async function () {
    const updateDataSetNulls = {
      salary: null,
      equity: null
    };

    let job = await Job.update(2, updateDataSetNulls);
    expect(job).toEqual({
      id: 2,
      companyHandle: "c2",
      title: "j2",
      ...updateDataSetNulls,
    });

    const result = await db.query(
      `SELECT id, title, salary, equity, company_handle
        FROM jobs
        WHERE id = 2`);
    expect(result.rows).toEqual([{
      "company_handle": "c2",
      "equity": null,
      "id": 2,
      "salary": null,
      "title": "j2",
    }]);
  });


  test("not found if no such job id", async function () {
    try {
      await Job.update(9999, updateData);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });

  test("bad request with no data", async function () {
    try {
      await Job.update(2, {});
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof BadRequestError).toBeTruthy();
    }
  });
});

/************************************** remove */

describe("remove", function () {
  test("works", async function () {
    await Job.remove(1);
    const res = await db.query(
      "SELECT id FROM jobs WHERE id='1'");
    expect(res.rows.length).toEqual(0);
  });


  test("not found if no such job id", async function () {
    try {
      await Job.remove(999);
      throw new Error("fail test, you shouldn't get here");
    } catch (err) {
      expect(err instanceof NotFoundError).toBeTruthy();
    }
  });
});

