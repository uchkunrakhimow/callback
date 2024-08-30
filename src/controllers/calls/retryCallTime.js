const retryCallTime = (numCalls) => {
  return numCalls >= 90 ? 9 : numCalls >= 20 ? 2 : numCalls >= 10 ? 1 : 1;
};

module.exports = { retryCallTime };
