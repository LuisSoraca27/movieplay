import React, { useEffect, useRef } from "react";
import "../style/login.css";
import "react-toastify/dist/ReactToastify.css";
import { createUserSellerThunk } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import useErrorHandler from "../Helpers/useErrorHandler";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

const RegisterSeller = () => {
  const initialData = {
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "seller",
  };

  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success } = useSelector((state) => state.error);
  const [dataUser, setDataUser] = React.useState(initialData);
  const [loading, setLoading] = React.useState(false);
  const handleError = useErrorHandler(error, success);

  const notify = () =>
    toast.current.show({
      severity: "info",
      summary: "Registrate y recibe",
      detail: "10% de descuento en tu primera recarga",
      sticky: true,
    });

  const handleChange = (e) => {
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (dataUser != initialData) {
      dispatch(createUserSellerThunk(dataUser)).then(() => {
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      });
    }
  };

  // React.useEffect(() => {
  //   notify();
  // }, []);

  useEffect(() => {
    handleError(toast.current);
  }, [error, success]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  return (
    <>
      <Toast ref={toast} />
      <div className="containerLogin">
        <div className="login-container">
          <h2>Registro para vendedores</h2>
          <form onSubmit={handleSubmit}>
            <label htmlFor="username">Nombre de usuario</label>
            <InputText
              type="text"
              placeholder="Nombre de usuario"
              name="username"
              value={dataUser.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="phone">Numero de Whatsapp</label>
            <InputText
              type="text"
              placeholder="Numero de Whatsapp"
              name="phone"
              value={dataUser.phone}
              onChange={handleChange}
              required
            />
            <label htmlFor="email">Correo Electrónico</label>
            <InputText
              type="email"
              placeholder="Correo electrónico"
              name="email"
              value={dataUser.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Contraseña</label>
            <InputText
              type="password"
              placeholder="Contraseña"
              name="password"
              value={dataUser.password}
              onChange={handleChange}
              required
            />
            <Button
              label="Registrarse"
              className="p-button-rounded"
              type="submit"
              loading={loading}
              disabled={loading}
            />
            <p style={{ fontWeight: 500, textAlign: "center" }}>
              ¿Ya tienes una cuenta?{" "}
              <a
                style={{
                  color: "#2f73f1",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                href="#/login"
              >
                inicia sesión
              </a>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterSeller;
