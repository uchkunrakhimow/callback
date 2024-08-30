import { useEffect, useState } from "react";
import { Loader, toaster, Message } from "rsuite";
import { ConfirmationModal, DataTable } from "@/components";
import { socket } from "@/socket";
import axios from "axios";

const Statistics = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const handleOpen = (id) => {
    setSelectedId(id);
    setOpen(true);
  };
  const handleClose = () => setOpen(false);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem("progressData")) || [];
    setData(storedData);

    socket.on("connect", () => {
      socket.on("result", (resultData) => {
        updateData(resultData);
      });

      socket.on("disconnect", () => {
        toaster.push(
          <Message showIcon type="info">
            Произошёл сбой на сервере
          </Message>
        );

        localStorage.removeItem("progressData");
        setData([]);
      });
    });
  }, []);

  const updateData = (newData) => {
    setData((prevData) => {
      const updatedData = [...prevData];

      const existingDataItemIndex = updatedData.findIndex(
        (item) => item.id === newData.id
      );

      if (existingDataItemIndex !== -1) {
        updatedData[existingDataItemIndex].progress = newData.progress;
      } else {
        updatedData.push(newData);
      }

      localStorage.setItem("progressData", JSON.stringify(updatedData));
      return updatedData;
    });
  };

  const handleId = () => {
    axios
      .post("/cancelProgress", { id: selectedId })
      .then(() => {
        const storedData =
          JSON.parse(localStorage.getItem("progressData")) || [];
        const updatedData = storedData.filter((item) => item.id !== selectedId);
        localStorage.setItem("progressData", JSON.stringify(updatedData));
        setData(updatedData);
        setOpen(false);
        toaster.push(
          <Message showIcon type="success">
            Отмена успешно завершена!
          </Message>
        );
      })
      .catch((error) => {
        toaster.push(
          <Message showIcon type="error">
            Не удалось отменить
          </Message>
        );
        console.error("Error canceling progress:", error);
      });
  };

  useEffect(() => {
    const progressData = localStorage.getItem("progressData");
    const parsedProgressData = JSON.parse(progressData);

    if (Array.isArray(parsedProgressData) && parsedProgressData.length > 0) {
      const filteredArray = parsedProgressData.filter(
        (item) => item.progress !== 100
      );
      const updatedProgressData = JSON.stringify(filteredArray);

      setTimeout(() => {
        localStorage.setItem("progressData", updatedProgressData);
        window.location.reload();
      }, 2 * 60 * 1000);
    } else {
      localStorage.removeItem("progressData");
    }
  }, []);

  return (
    <div className="layout">
      <h3 className="main-text">Статистика</h3>

      {data.length > 0 ? (
        <DataTable data={data} handleOpen={handleOpen} />
      ) : (
        <Loader content="Данные отсутствуют..." />
      )}

      <ConfirmationModal
        open={open}
        onClose={handleClose}
        onConfirm={handleId}
      />
    </div>
  );
};

export { Statistics };
