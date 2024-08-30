const connection = require("./connection");

const insertQuery = `
  CREATE TABLE data (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rangeNumbers VARCHAR(255),
    numberAttempts INT,
    numCalls INT,
    betweenAttempts INT,
    queueName VARCHAR(255),
    monSaturday TINYINT,
    monFriday TINYINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )
`;

connection
  .execute(insertQuery)
  .then((results) => {
    console.log("Migration completed successfully");
  })
  .catch((error) => {
    if (error.code === "ER_TABLE_EXISTS_ERROR") {
      console.error("You already have this table");
    } else {
      console.error("An error occurred during migration:", error.message);
    }
  })
  .finally(() => {
    connection.end();
  });
