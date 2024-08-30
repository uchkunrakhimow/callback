const express = require("express");
const router = express.Router();
const { pathFile, readFile, getInsertId } = require("../utils");
const { bulkDialing, schedNumBatches, retryCall } = require("../controllers");
const { getDataById } = require("../models");

router.post("/file_upload", pathFile.single("file"), async (req, res) => {
  try {
    setTimeout(async () => {
      const insertId = getInsertId();
      const record = await getDataById(insertId);

      const {
        numCalls,
        rangeDateTime,
        monSaturday,
        monFriday,
        betweenAttempts,
        numberAttempts,
        queueName,
      } = record;

      const { io } = req;

      const fileContent = readFile(req.file.path);
      const numbersArray = fileContent
        .split("\n")
        .map((number) => parseInt(number));

      const handleNumbers = (numbers) => {
        bulkDialing(numbers, queueName);

        if (numberAttempts) {
          retryCall(numbers, betweenAttempts, numberAttempts);
        }
      };

      const handlePercentage = (perst, uuid) => {
        const res = {
          id: uuid,
          progress: perst,
        };

        io.emit("result", res);
      };

      schedNumBatches(
        numbersArray,
        numCalls,
        monSaturday,
        monFriday,
        1,
        rangeDateTime,
        handleNumbers,
        handlePercentage
      );
    }, 2000);
    res.status(200).send("Successfully!");
  } catch (error) {
    res.status(500).send(`Server error: ${error}`);
  }
});

module.exports = router;
