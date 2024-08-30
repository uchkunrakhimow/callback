const ami = require("../../lib/ami");

const bulkDialing = async (phoneNumberList, queueName) => {
  for (const phoneNumber of phoneNumberList) {
    await ami.action({
      action: "originate",
      channel: `Local/${phoneNumber}@callbackout`,
      context: "callback",
      exten: phoneNumber,
      priority: 1,
      variable: `Queuename=${queueName}`,
      callerid: 900,
      async: "true",
    });

    await new Promise((resolve) => setTimeout(resolve, 0));
  }
};

module.exports = { bulkDialing };
