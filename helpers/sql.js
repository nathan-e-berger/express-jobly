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


/** sqlForCompanyFilter: Takes in parameters to filter and builds a
 *  dynamic WHERE statement if values are passed in.
 *
 * Accepts { nameLike, minEmployees, maxEmployees }
 *
 * Returns
 *        {
 *        whereStatement: "WHERE num_employees >= $1 ..."
 *        values: [nameLike, minEmployees, maxEmployees]
 *        }
 */
//TODO:move to model for better encaps
function sqlForCompanyFilter({ nameLike, minEmployees, maxEmployees }) {

  let whereStatements = [];
  let params = [];
  let idx = 1;

  if (nameLike) {
    whereStatements.push(`name ILIKE $${idx}`);
    params.push(`%${nameLike}%`);
    idx++;

  }

  if (minEmployees) {
    whereStatements.push(`num_employees >= $${idx}`);
    params.push(minEmployees);
    idx++;
  }

  if (maxEmployees) {
    whereStatements.push(`num_employees <= $${idx}`);
    params.push(maxEmployees);
    idx++;
  }

  return {
    whereStatement: "WHERE ".concat(whereStatements.join(" AND ")),
    values: params,
  };
}

module.exports = { sqlForPartialUpdate, sqlForCompanyFilter };