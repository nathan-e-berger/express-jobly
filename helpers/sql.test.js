"use strict";

const { sqlForPartialUpdate } = require("./sql");

/************************************** sqlForPartialUpdate */

describe("sqlForPartialUpdate", function () {
  test("mimic inputs for User model", async function () {
    const data = {
      firstName: "nathan",
      lastName: "irrelevant",
      email: "test@test.com",
      password: "password"
    };

    const jsToSql = {
      firstName: "first_name",
      lastName: "last_name",
      isAdmin: "is_admin",
    };

    const result = sqlForPartialUpdate(data, jsToSql);
    expect(result).toEqual({
      setCols: '\"first_name\"=$1, \"last_name\"=$2, \"email\"=$3, \"password\"=$4',
      values: ["nathan", "irrelevant", "test@test.com", "password"],
    });
  });

  test("mimic inputs for Company model", async function () {
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
      setCols: '\"name\"=$1, \"description\"=$2, \"num_employees\"=$3, \"logo_url\"=$4',
      values: ["fake", "not real", "20", "test.fakephoto.com"]
    });
  });

  test("missing data input expects error", async function () {
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