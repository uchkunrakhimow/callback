const express = require("express");
const { stopBatchByUUID } = require("../controllers");

const router = express.Router();
router.post("/cancelProgress", async (req, res) => {
  try {
    const { id } = req.body;
    if (id) {
      stopBatchByUUID(id);
      res.status(200).send(`Stopped batch with: ${id}`);
    } else {
      res.status(400).send("ID not found");
    }
  } catch (error) {
    res.status(500).send(`Server error: ${error}`);
  }
});

module.exports = router;
