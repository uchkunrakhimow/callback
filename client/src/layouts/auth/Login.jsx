import { createRef, useState, useEffect } from "react";
import { Form, Button, ButtonToolbar, Schema, toaster, Message } from "rsuite";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const { StringType } = Schema.Types;

const requiredMsg = "Это поле обязательно к заполнению.";

const model = Schema.Model({
  name: StringType().isRequired(requiredMsg),
  passwd: StringType().isRequired(requiredMsg),
});

const Login = () => {
  const formRef = createRef();
  const [username, setUsername] = useState("");
  const [passwd, setPasswd] = useState("");

  const navigate = useNavigate();
  const logged_in = Cookies.get("logged_in");

  const onSubmitting = () => {
    if (formRef.current.check()) {
      const formValue = { username, passwd };

      axios
        .post("/auth/login", formValue)
        .then((res) => {
          const accessToken = res.data.accessToken;

          // Store the accessToken in a cookie with an expiration time
          Cookies.set("user_session", accessToken, { expires: 1 });
          Cookies.set("logged_in", "yes", { expires: 1 });

          toaster.push(
            <Message showIcon type="success">
              Вы успешно вошли в
            </Message>
          );

          navigate("/admin");
          window.location.reload;
        })
        .catch((err) => {
          if (
            err.response &&
            err.response.data.error === "Invalid credentials"
          ) {
            toaster.push(
              <Message showIcon type="error">
                Введен неверный пароль
              </Message>
            );
          } else if (
            err.response &&
            err.response.data.error === "User not found"
          ) {
            toaster.push(
              <Message showIcon type="error">
                Пользователь не найден
              </Message>
            );
          }
        });
    }
  };

  useEffect(() => {
    if (location.pathname === "/login" && logged_in === "yes") {
      navigate("/admin");
    } else if (location.pathname === "/admin" && !logged_in) {
      navigate("/login");
    }
  }, [navigate, logged_in]);

  return (
    <section className="box-center">
      <div className="bordered">
        <Form model={model} ref={formRef}>
          <h4 className="mxy-1">Служба вызовов</h4>
          <Form.Group controlId="name-3">
            <Form.ControlLabel>Логин</Form.ControlLabel>
            <Form.Control
              value={username}
              name="name"
              defaultValue=""
              autoComplete="username"
              onChange={(value) => setUsername(value)}
            />
          </Form.Group>

          <Form.Group controlId="passwd-3">
            <Form.ControlLabel>Пароль</Form.ControlLabel>
            <Form.Control
              name="passwd"
              type="password"
              defaultValue=""
              autoComplete="current-password"
              value={passwd}
              onChange={(value) => setPasswd(value)}
            />
          </Form.Group>

          <ButtonToolbar>
            <Button appearance="primary" type="submit" onClick={onSubmitting}>
              Войти
            </Button>
          </ButtonToolbar>
        </Form>
      </div>
    </section>
  );
};

export { Login };
