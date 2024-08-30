const connection = require("./connection");

const truncateQuery = `TRUNCATE TABLE data`;

connection
  .execute(truncateQuery)
  .then(() => {
    console.log("Truncate successful");
  })
  .catch((error) => {
    console.error("Truncate error:", error.message);
  })
  .finally(() => {
    connection.end();
  });
