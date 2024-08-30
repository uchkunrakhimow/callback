require("dotenv").config();
const AMI = require("asterisk-manager");

const ami = new AMI(
  process.env.ASTERISK_PORT,
  process.env.ASTERISK_HOST,
  process.env.ASTERISK_USERNAME,
  process.env.ASTERISK_PASSWD,
  true,
);

const keepConnected = () => {
  ami.action({ Action: "Ping" });
};

setInterval(keepConnected, 30000);

module.exports = ami;
