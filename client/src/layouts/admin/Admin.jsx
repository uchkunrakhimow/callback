import React, { useEffect, useState } from "react";
import {
  Form,
  SelectPicker,
  InputNumber,
  Row,
  Col,
  Button,
  ButtonToolbar,
  toaster,
  Message,
  Divider,
} from "rsuite";
import { workingHourOptions, betweenCallsTimesOptions } from "@/data";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const Field = (props) => {
  const { name, message, label, accepter, error, value, onChange, ...rest } =
    props;
  return (
    <Form.Group
      controlId={`${name}-10`}
      className={error ? "has-error" : ""}
      style={{ marginBottom: "1.8rem" }}
    >
      <Form.ControlLabel>{label}</Form.ControlLabel>
      <Form.Control
        name={name}
        accepter={accepter}
        errorMessage={error}
        value={value}
        onChange={onChange}
        {...rest}
        disabled={Boolean(rest.disabled)}
      />
    </Form.Group>
  );
};

const Admin = () => {
  const [startWorkingHour, setStartWorkingHour] = useState("");
  const [endWorkingHour, setEndWorkingHour] = useState("");
  const [maxCall, setMaxCall] = useState("");
  const [betweenCallsTimes, setBetweenCallsTimes] = useState("");
  const [buttonsDisabled, setButtonsDisabled] = useState(false);

  const navigate = useNavigate();
  const logged_in = Cookies.get("logged_in");

  const performRequest = (data, successMsg, errMsg) => {
    setButtonsDisabled(true);

    setTimeout(() => {
      toaster.push(
        <Message showIcon type="info">
          Кнопки отключаются на некоторое время, чтобы не отправлялся запрос и
          сбрасывались настройки
        </Message>
      );
    }, 2000);

    axios
      .post("/api/config", data)
      .then(() => {
        toaster.push(
          <Message showIcon type="success">
            {successMsg}
          </Message>
        );
        setStartWorkingHour("");
        setEndWorkingHour("");
        setBetweenCallsTimes("");
        setMaxCall("");
        setTimeout(() => {
          setButtonsDisabled(false); // Enable buttons after 20 seconds
          toaster.push(
            <Message showIcon type="info">
              Сервер перезагружен, можно отправлять запросы
            </Message>
          );
        }, 30000);
      })
      .catch((err) => {
        toaster.push(
          <Message showIcon type="success">
            {errMsg}
          </Message>
        );
        setButtonsDisabled(false); // Enable buttons in case of an error
        console.error(err.response.data.message);
      });
  };

  const restartServer = () => {
    const data = {
      restart: true,
    };
    const succesMessage =
      "Отправлен запрос на перезагрузку сервера, через несколько минут сервер перезагрузится";

    const errMessage =
      "Не удалось перезапустить сервер. Повторите попытку позже.";

    performRequest(data, succesMessage, errMessage);
  };

  const stopAllQueue = () => {
    const data = {
      stopAllQueue: true,
    };
    const succesMessage = "Все очереди успешно завершены";

    const errMessage =
      "Все очереди не удалось остановить. Повторите попытку позже.";

    performRequest(data, succesMessage, errMessage);
  };

  const saveAllData = () => {
    if (
      !startWorkingHour &&
      !endWorkingHour &&
      !betweenCallsTimes &&
      !maxCall
    ) {
      toaster.push(
        <Message showIcon type="error">
          Заполните все поля перед сохранением.
        </Message>
      );
      return;
    }

    const data = {
      callSettings: {
        startWorkingHour: startWorkingHour,
        endWorkingHour: endWorkingHour,
        betweenCallsTimes: betweenCallsTimes,
        maxCall: maxCall,
      },
    };
    const succesMessage = "Успешно принято";

    const errMessage =
      "Не удалось отправить сообщение. Повторите попытку позже.";

    performRequest(data, succesMessage, errMessage);
  };

  const clearAllFields = () => {
    if (
      !startWorkingHour &&
      !endWorkingHour &&
      !betweenCallsTimes &&
      !maxCall
    ) {
      toaster.push(
        <Message showIcon type="warning">
          Поля уже пусты.
        </Message>
      );
      return;
    }

    setStartWorkingHour("");
    setEndWorkingHour("");
    setBetweenCallsTimes("");
    setMaxCall("");

    toaster.push(
      <Message showIcon type="success">
        Поля очищены
      </Message>
    );
  };

  useEffect(() => {
    if (location.pathname === "/login" && logged_in === "yes") {
      navigate("/admin");
    } else if (location.pathname === "/admin" && !logged_in) {
      navigate("/login");
    }
  }, [navigate, logged_in]);

  return (
    <section className="container">
      <div className="layout">
        <Form>
          <Row className="show-grid">
            <Col xs={9}>
              <Field
                name="startWorkingHour"
                label="Время начала"
                placeholder="09:00"
                className="select-picker"
                accepter={SelectPicker}
                data={workingHourOptions}
                searchable={true}
                value={startWorkingHour}
                onChange={(value) => setStartWorkingHour(value)}
              />
              <Field
                name="endWorkingHour"
                label="Время окончания"
                placeholder="22:00"
                className="select-picker"
                accepter={SelectPicker}
                data={workingHourOptions}
                searchable={true}
                value={endWorkingHour}
                onChange={(value) => setEndWorkingHour(value)}
              />
              <Field
                name="maxCall"
                label="Макс. звонок"
                placeholder="100"
                accepter={InputNumber}
                value={maxCall}
                onChange={(value) => setMaxCall(value)}
              />
            </Col>
            <Col xs={12}>
              <Field
                name="betweenCallsTimes"
                label="Время между звонками"
                placeholder="1 минут"
                className="select-picker"
                accepter={SelectPicker}
                data={betweenCallsTimesOptions}
                searchable={true}
                value={betweenCallsTimes}
                onChange={(value) => setBetweenCallsTimes(value)}
              />
              <ButtonToolbar>
                <Button
                  appearance="primary"
                  onClick={saveAllData}
                  disabled={buttonsDisabled}
                >
                  Сохранить
                </Button>
                <Button
                  appearance="default"
                  onClick={clearAllFields}
                  disabled={buttonsDisabled}
                >
                  Очистка поля
                </Button>
              </ButtonToolbar>

              <Divider />

              <div>
                <p style={{ marginBottom: "1rem" }}>
                  Дополнительные возможности:
                </p>
              </div>

              <ButtonToolbar>
                <Button
                  appearance="primary"
                  onClick={stopAllQueue}
                  disabled={buttonsDisabled}
                >
                  Остановить все номера в очереди
                </Button>
                <Button
                  appearance="primary"
                  onClick={restartServer}
                  disabled={buttonsDisabled}
                >
                  Перезапустить сервер
                </Button>
              </ButtonToolbar>
            </Col>
          </Row>
        </Form>
      </div>
    </section>
  );
};

export { Admin };
