const path = require("node:path");
const fs = require("node:fs");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: "src/storage/",
  filename: (req, file, cb) => {
    const originalName = file.originalname;
    const fileExtension = path.extname(originalName);
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const newFileName = uniqueSuffix + fileExtension;
    cb(null, newFileName);
  },
});

const pathFile = multer({ storage });

const readFile = (filePath) => {
  return fs.readFileSync(filePath, "utf-8");
};

module.exports = { pathFile, readFile };
