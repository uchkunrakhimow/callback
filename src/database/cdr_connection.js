require("dotenv").config();

const mysql2 = require("mysql2/promise");
const connection = mysql2.createPool(process.env.CDR_DB_URI);

module.exports = connection;
