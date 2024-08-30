import { useState, useRef, useEffect } from "react";
import {
  Form,
  Grid,
  Row,
  Col,
  Button,
  Radio,
  RadioGroup,
  SelectPicker,
  Schema,
  InputNumber,
  Message,
  toaster,
  Input,
  Uploader,
  Tooltip,
  Whisper,
} from "rsuite";

import { betweenAttemptsOptions, numberAttemptsOptions } from "../../data";
import axios from "axios";
import { socket } from "@/socket";

const Field = (props) => {
  const { name, message, label, accepter, error, ...rest } = props;
  return (
    <Form.Group
      controlId={`${name}-10`}
      className={error ? "has-error" : ""}
      style={{ marginBottom: "1.8rem" }}
    >
      <Form.ControlLabel>{label} </Form.ControlLabel>
      <Form.Control
        name={name}
        accepter={accepter}
        errorMessage={error}
        {...rest}
        disabled={Boolean(rest.disabled)}
      />
    </Form.Group>
  );
};

const { NumberType } = Schema.Types;
const model = Schema.Model({
  numCalls: NumberType()
    .isRequired("Это поле обязательно к заполнению.")
    .min(20, "Значение должно быть не меньше 20.")
    .max(40, "Значение должно быть не больше 40."),
});

const defaultFormValue = {
  rangeNumbers: "",
  numberAttempts: "",
  betweenAttempts: "",
  numCalls: "20",
  monSaturday: false,
  monFriday: false,
  queue: "",
};

const CallService = () => {
  const formRef = useRef();
  const uploader = useRef();
  const [formError, setFormError] = useState({});
  const [formValue, setFormValue] = useState(defaultFormValue);
  const [fileList, setFileList] = useState([]);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(false);
  const [queueOptions, setQueueOptions] = useState([]);

  const handleSubmit = () => {
    if (!formRef.current.check()) {
      return;
    }

    setIsSubmitDisabled(true);

    const rangeNumbers = formValue.rangeNumbers ? formValue.rangeNumbers : null;
    const betweenAttempts = parseInt(formValue.betweenAttempts);
    const numCalls = parseInt(formValue.numCalls);
    const numberAttempts = parseInt(formValue.numberAttempts);
    const monSaturday = formValue.monSaturday ? 1 : 0;
    const monFriday = formValue.monFriday ? 1 : 0;

    const formData = {
      rangeNumbers: rangeNumbers,
      numberAttempts: numberAttempts,
      betweenAttempts: betweenAttempts,
      numCalls: numCalls,
      monSaturday: monSaturday,
      monFriday: monFriday,
      queueName: formValue.queue,
    };

    uploader.current.start();
    axios
      .post("/upload", formData)
      .then(() => {
        toaster.push(
          <Message showIcon type="success">
            Операция началась успешно!
          </Message>
        );
        setFormValue(defaultFormValue);
        setFileList([]);

        if (!localStorage.getItem("progressData")) {
          setIsSubmitDisabled(false);
        }
      })
      .catch((err) => {
        toaster.push(
          <Message showIcon type="error">
            Ошибка при отправке данных
          </Message>
        );

        console.error(err.response.data.message);
        setIsSubmitDisabled(false);
      });
  };

  const handleClearForm = () => {
    const hasChanges = Object.keys(formValue).some(
      (key) => formValue[key] !== defaultFormValue[key]
    );

    if (hasChanges) {
      setFormValue(defaultFormValue);
      toaster.push(
        <Message showIcon type="success">
          Форма успешно очищена!
        </Message>
      );
    } else {
      toaster.push(
        <Message showIcon type="warning">
          Поля уже очищены!
        </Message>
      );
    }
  };

  const handleWeekDaysChange = (value) => {
    const monSaturday = value === "monSaturday";
    const monFriday = value === "monFriday";
    setFormValue((prevFormValue) => ({
      ...prevFormValue,
      monSaturday,
      monFriday,
    }));
  };

  const handleNumberAttemptsChange = (value) => {
    if (value) {
      setFormValue((prevFormValue) => ({
        ...prevFormValue,
        betweenAttempts: "5",
      }));
    } else {
      setFormValue((prevFormValue) => ({
        ...prevFormValue,
        betweenAttempts: "",
      }));
    }
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

  const performRequest = (data, successMsg, errMsg) => {
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
        setTimeout(() => {
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
        console.error(err.response.data.message);
      });
  };

  useEffect(() => {
    socket.on("connect", () => {
      socket.on("result", (resultData) => {
        const progress = resultData.progress;
        if (progress !== 100) {
          setIsSubmitDisabled(true);
        } else if (progress === null || progress === 0 || progress === 100) {
          setIsSubmitDisabled(false);
        } else {
          setIsSubmitDisabled(false);
        }
      });

      socket.on("queueNames", (response) => {
        setQueueOptions(response);
      });
    });
  }, []);

  return (
    <div className="layout">
      <h3 className="main-text">Служба вызовов</h3>
      <Grid fluid>
        <Form
          ref={formRef}
          onCheck={setFormError}
          model={model}
          formValue={formValue}
          onChange={(formValue) => setFormValue(formValue)}
          onSubmit={handleSubmit}
        >
          <Row className="show-grid">
            <Col xs={12}>
              <Field
                name="rangeNumbers"
                label="Укажите диапазон номеров"
                placeholder="9X0000000-9X0000999"
                accepter={Input}
                disabled={fileList.length}
              />
              <Field
                name="numberAttempts"
                label="Количество попыток"
                placeholder="Без попыток"
                className="select-picker"
                accepter={SelectPicker}
                data={numberAttemptsOptions}
                searchable={false}
                onChange={handleNumberAttemptsChange}
              />
              <Field
                name="betweenAttempts"
                label="Интервал между попытками"
                placeholder="Без попыток"
                className="select-picker"
                accepter={SelectPicker}
                data={betweenAttemptsOptions}
                searchable={false}
              />
              <Field
                name="numCalls"
                label="Количество одновременно звонков"
                placeholder="20-40"
                accepter={InputNumber}
                error={formError.numCalls}
              />
            </Col>
            <Col xs={12}>
              <Field
                name="queue"
                label="Имена очередей"
                placeholder="Без попыток"
                className="select-picker"
                accepter={SelectPicker}
                data={queueOptions}
                searchable={false}
              />
              <Form.ControlLabel style={{ display: "block" }}>
                Рабочая неделя
              </Form.ControlLabel>
              <RadioGroup
                name="workWeekDays"
                inline
                value={
                  formValue.monSaturday
                    ? "monSaturday"
                    : formValue.monFriday
                    ? "monFriday"
                    : ""
                }
                defaultValue=""
                onChange={handleWeekDaysChange}
                style={{ marginBottom: "1.8rem" }}
              >
                <Radio value="monSaturday">с пн-субб</Radio>
                <Radio value="monFriday">с пн-пят</Radio>
              </RadioGroup>
              <Form.ControlLabel style={{ display: "block" }}>
                Звонок из файла, сюда помещаются только файл *.txt
              </Form.ControlLabel>
              <Uploader
                name="file"
                action="/file_upload"
                accept=".txt"
                draggable={true}
                autoUpload={false}
                removable={true}
                onChange={setFileList}
                fileList={fileList}
                ref={uploader}
                disabled={!!formValue.rangeNumbers}
              >
                <Button>Нажмите и добавьте файл</Button>
              </Uploader>
              <Form.Group style={{ textAlign: "end" }}>
                <Whisper
                  placement="top"
                  disabled={!isSubmitDisabled}
                  speaker={
                    <Tooltip>
                      Следующий не может быть отправлен до тех.пор, пока не
                      будет завершена первая очередь.
                    </Tooltip>
                  }
                >
                  <Button
                    type="submit"
                    appearance="primary"
                    style={{ marginRight: "1rem" }}
                    disabled={
                      isSubmitDisabled === true ||
                      (!formValue.rangeNumbers && !fileList.length)
                    }
                  >
                    Применить
                  </Button>
                </Whisper>

                <Button onClick={handleClearForm}>Очистка поля</Button>
                <Button
                  appearance="primary"
                  onClick={restartServer}
                  style={{ marginLeft: "1rem" }}
                >
                  Перезапустить сервер
                </Button>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Grid>
    </div>
  );
};

export { CallService };
