import React, { useEffect, useState } from "react";
import axios from "axios";

const Logs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    axios
      .post("/api/logs")
      .then((res) => {
        setLogs(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const colorizeMessage = (message) => {
    if (message.includes("level: 'info'")) {
      return <b style={{ color: "blue" }}>{message}</b>;
    } else if (message.includes("level: 'warn'")) {
      return <b style={{ color: "yellow" }}>{message}</b>;
    } else if (message.includes("level: 'error'")) {
      return <b style={{ color: "red" }}>{message}</b>;
    } else {
      return <span>{message}</span>;
    }
  };

  const logItems = logs.map((log, index) => (
    <div key={index}>
      <code style={{ whiteSpace: "pre-wrap" }}>
        {log.content.split("\n").map((line, index) => (
          <span key={index}>
            {colorizeMessage(line)}
            <br />
          </span>
        ))}
      </code>
    </div>
  ));

  return (
    <section style={{ background: "#000", color: "#ffff" }}>{logItems}</section>
  );
};

export { Logs };
