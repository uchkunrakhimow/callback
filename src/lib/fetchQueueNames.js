const ami = require("./ami");

module.exports = function fetchQueueNames(io) {
  ami.action(
    {
      action: "QueueStatus",
    },
    (err, res) => {
      if (err) {
        console.log("Error:", err);
        return;
      }

      // Process the response to get queue names
      if (res.response === "Success") {
        let queueNames = new Set();

        ami.on("managerevent", (event) => {
          if (event.event === "QueueParams") {
            if (event.queue) {
              queueNames.add(event.queue);
            }
          } else if (event.event === "QueueStatusComplete") {
            const formattedQueueNames = Array.from(queueNames).map((name) => ({
              value: name,
              label: name,
            }));

            io.on("connection", (socket) => {
              socket.emit("queueNames", formattedQueueNames);
            });
            // Stop listening to further events once the status is complete
            ami.removeAllListeners("managerevent");
          }
        });
      } else {
        console.log("No events in the response");
      }
    },
  );
};
