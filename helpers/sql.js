"use strict";

const { BadRequestError } = require("../expressError");

/** sqlForPartialUpdate: Takes in a partial set of data and provides the
 * outputs necessary for a SQL statement.
 *
 * Accepts
 *         dataToUpdate as { firstName, lastName, ... }
 *         jsToSql as {camelCase: snake_case} object for formatting
 *
 * Returns {
 *          setCols: "string of column names separated by comma,
 *                    parameterized variables and '/' "
 *
 *          values: [value1, value2, ... ]
 *         }
 * */
function sqlForPartialUpdate(dataToUpdate, jsToSql) {
  const keys = Object.keys(dataToUpdate);
  if (keys.length === 0) throw new BadRequestError("No data");

  // {firstName: 'Aliya', age: 32} => ['"first_name"=$1', '"age"=$2']
  const cols = keys.map((colName, idx) =>
    `"${jsToSql[colName] || colName}"=$${idx + 1}`,
  );

  return {
    setCols: cols.join(", "),
    values: Object.values(dataToUpdate),
  };
}

module.exports = { sqlForPartialUpdate };
