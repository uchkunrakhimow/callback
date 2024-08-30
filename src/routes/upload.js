const express = require("express");
const { schedNumBatches, bulkDialing, retryCall } = require("../controllers");
const { insertData } = require("../models");
const { setInsertId } = require("../utils");

const router = express.Router();
router.post("/upload", async (req, res) => {
  try {
    const {
      rangeNumbers,
      numberAttempts,
      numCalls,
      betweenAttempts,
      monFriday,
      monSaturday,
      queueName,
    } = req.body;
    const { io } = req;

    const insertId = await insertData(
      rangeNumbers,
      numberAttempts,
      betweenAttempts,
      numCalls,
      queueName,
      monSaturday,
      monFriday
    );

    if (!insertId) {
      return res.status(400).send("Missing insertId");
    }

    if (rangeNumbers) {
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
        rangeNumbers,
        numCalls,
        monSaturday,
        monFriday,
        1,
        handleNumbers,
        handlePercentage
      );
    }

    setInsertId(insertId);
    res.status(200).send("Successfully!");
  } catch (error) {
    res.status(500).send(`Server error: ${error}`);
  }
});

module.exports = router;
