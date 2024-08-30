const {
  insertData,
  getDataById,
  getLastData,
  updateStatistics,
} = require("./data");

const { checkDisposition } = require("./cdr");

module.exports = {
  insertData,
  getDataById,
  getLastData,
  updateStatistics,
  checkDisposition,
};
