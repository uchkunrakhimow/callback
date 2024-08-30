const { bulkDialing } = require("./bulkDialing");
const { checkDisposition } = require("../../models/");

const retryCall = async (inputNumbers, timeoutMinutes, repeatCount) => {
  const resultArray = [...inputNumbers];
  let runCount = 0;

  const interval = setInterval(async () => {
    if (runCount >= repeatCount) {
      clearInterval(interval);
      resultArray.length = 0;
      return;
    }

    const disposedNumbers = [];
    for (let i = resultArray.length - 1; i >= 0; i--) {
      const num = resultArray[i];
      const dispositionResult = await checkDisposition(num);
      if (!dispositionResult) {
        resultArray.splice(i, 1);
      } else {
        disposedNumbers.push(num);
      }
    }

    bulkDialing(disposedNumbers);

    runCount++;
  }, timeoutMinutes * 60 * 1000);
};

module.exports = {
  retryCall,
};
