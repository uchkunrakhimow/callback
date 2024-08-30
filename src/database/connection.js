require("dotenv").config();

const mysql2 = require("mysql2/promise");
const connection = mysql2.createPool(process.env.DB_URI);

module.exports = connection;
