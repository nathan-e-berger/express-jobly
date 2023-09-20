"use strict";

const { BadRequestError } = require("../expressError");

/** sqlForPartialUpdate: Takes in a set of data and provides the
 * outputs necessary to build a SQL update statement.
 *
 * Accepts
 *         dataToUpdate as { firstName, lastName, ... }
 *         jsToSql as {camelColumnName: snake_column_name} object for formatting
 *
 * Returns {
 *          setCols: "formatted string of column names set to
 *                    parameterized variables"
 *          values: [dataValue1, dataValue2, ... ]
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
