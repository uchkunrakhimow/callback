const connection = require("./connection");

const rollbackQuery = `DROP TABLE IF EXISTS data`;

connection
  .execute(rollbackQuery)
  .then(() => {
    console.log("Data rollback was successful!");
  })
  .catch((error) => {
    console.error("Error returning data:", error.message);
  })
  .finally(() => {
    connection.end();
  });
