"use strict";

const request = require("supertest");
const { sqlForPartialUpdate } = require("./sql");
const { BadRequestError } = require("../expressError");


/**
 *  test with data set input data,
 *
 *   - test that camel to snake case works
 *   - that output matches
 *
 * happy path
 */
describe("sqlForPartialUpdate's expected output", function () {
  test("output constains the input", async function () {
    const data = {
      firstName: "nathan",
      lastName: "irrelevant",
      email: "test@test.com",
      password: "password"
    };

    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
    };

    const result = sqlForPartialUpdate(data, jsToSql);
    expect(result).toEqual({
      setCols: '\"first_name\"=$1, \"last_name\"=$2, \"email\"=$3, \"password\"=$4',
      values: ["nathan", "irrelevant", "test@test.com", "password"],
    });
  });

  test("test that company data is updated", async function () {
    const data = {
      name: "fake",
      description: "not real",
      numEmployees: "20",
      logoUrl: "test.fakephoto.com"
    };

    const jsToSql = {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    };
    const result = sqlForPartialUpdate(data, jsToSql);
    expect(result).toEqual({
      "setCols": "\"name\"=$1, \"description\"=$2, \"num_employees\"=$3, \"logo_url\"=$4",
      "values": ["fake", "not real", "20", "test.fakephoto.com"]
    });
  });

  test("can handle missing data as input", async function () {
    const data = {};

    const jsToSql = {
      numEmployees: "num_employees",
      logoUrl: "logo_url",
    };
    expect(() => {
      sqlForPartialUpdate(data, jsToSql);
    }).toThrow("No data");
  });
});