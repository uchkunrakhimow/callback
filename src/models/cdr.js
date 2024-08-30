const connection = require("../database/cdr_connection");

const checkDisposition = async (inputNumber) => {
  const query = "SELECT * FROM cdr WHERE dst = ? ORDER BY id DESC LIMIT 1";
  try {
    const [rows] = await connection.execute(query, [inputNumber]);

    if (rows.length === 0) {
      return false;
    }

    const { disposition } = rows[0];
    if (disposition == "BUSY" || disposition == "NO ANSWER") {
      return inputNumber;
    } else {
      return;
    }
  } catch (error) {
    console.error(error.message);
    return false;
  }
};

module.exports = { checkDisposition };
