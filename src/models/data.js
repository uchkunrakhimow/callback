const connection = require("../database/connection");

const insertData = async (
  rangeNumbers,
  numberAttempts,
  betweenAttempts,
  numCalls,
  queuename,
  monSaturday,
  monFriday
) => {
  const query = `
    INSERT INTO data (
      rangeNumbers,
      numberAttempts,
      betweenAttempts,
      numCalls,
      queuename,
      monSaturday,
      monFriday
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await connection.execute(query, [
      rangeNumbers,
      numberAttempts,
      betweenAttempts,
      numCalls,
      queuename,
      monSaturday,
      monFriday,
    ]);

    return result.insertId;
  } catch (error) {
    console.error(`Error while writing to the database: ${error.message}`);
  }
};

const getDataById = async (id) => {
  const query = "SELECT * FROM data WHERE id = ?";
  try {
    const [rows] = await connection.execute(query, [id]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error(`Error while getting data by ID: ${error.message}`);
  }
};

const getLastData = async () => {
  const query = "SELECT * FROM data ORDER BY id DESC LIMIT 1";
  try {
    const [rows] = await connection.execute(query);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error(
      `Error while getting specific columns of last record: ${error.message}`
    );
  }
};

const updateStatistics = async (data, insertId) => {
  const query =
    "UPDATE data SET statistics = ? WHERE id = ? ORDER BY id DESC LIMIT 1";
  try {
    const [rows] = await connection.execute(query, [data, insertId]);
    if (rows.length === 0) {
      return null;
    }
    return rows[0];
  } catch (error) {
    console.error(`Error getting statistics: ${error.message}`);
  }
};

module.exports = { insertData, getDataById, getLastData, updateStatistics };
