let currentInsertId = null;
const setInsertId = (insertId) => (currentInsertId = insertId);
const getInsertId = () => currentInsertId;

module.exports = {
  setInsertId,
  getInsertId,
};
