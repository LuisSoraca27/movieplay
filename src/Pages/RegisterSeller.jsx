import React, { useEffect, useRef } from "react";
import "../style/login.css";
import "react-toastify/dist/ReactToastify.css";
import { createUserSellerThunk } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { Toast } from "primereact/toast";
import useErrorHandler from "../Helpers/useErrorHandler";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import getPrefixCountry from "../utils/functions/getPrefixCountry";

const RegisterSeller = () => {
  const initialData = {
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "seller",
    country: '',
  };

  const countries = [
    { name: "Afganistán", code: "AF" },
    { name: "Alemania", code: "DE" },
    { name: "Arabia Saudita", code: "SA" },
    { name: "Argentina", code: "AR" },
    { name: "Australia", code: "AU" },
    { name: "Bélgica", code: "BE" },
    { name: "Bolivia", code: "BO" },
    { name: "Brasil", code: "BR" },
    { name: "Canadá", code: "CA" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Corea del Sur", code: "KR" },
    { name: "Costa Rica", code: "CR" },
    { name: "Cuba", code: "CU" },
    { name: "Dinamarca", code: "DK" },
    { name: "Ecuador", code: "EC" },
    { name: "Egipto", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "España", code: "ES" },
    { name: "Estados Unidos", code: "US" },
    { name: "Francia", code: "FR" },
    { name: "Grecia", code: "GR" },
    { name: "Guatemala", code: "GT" },
    { name: "Honduras", code: "HN" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Irán", code: "IR" },
    { name: "Irlanda", code: "IE" },
    { name: "Israel", code: "IL" },
    { name: "Italia", code: "IT" },
    { name: "Japón", code: "JP" },
    { name: "México", code: "MX" },
    { name: "Nicaragua", code: "NI" },
    { name: "Noruega", code: "NO" },
    { name: "Panamá", code: "PA" },
    { name: "Paraguay", code: "PY" },
    { name: "Perú", code: "PE" },
    { name: "Portugal", code: "PT" },
    { name: "Reino Unido", code: "GB" },
    { name: "Rusia", code: "RU" },
    { name: "Suecia", code: "SE" },
    { name: "Suiza", code: "CH" },
    { name: "Uruguay", code: "UY" },
    { name: "Venezuela", code: "VE" },
    { name: "Otro", code: "OT" },
  ];

  const toast = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { error, success } = useSelector((state) => state.error);
  const [dataUser, setDataUser] = React.useState(initialData);
  const [loading, setLoading] = React.useState(false);
  const [country, setCountry] = React.useState(null);
 const [prefix, setPrefix] = React.useState("--");

  const handleError = useErrorHandler(error, success);

  const notify = () =>
    toast.current.show({
      severity: "info",
      summary: "Registrate y recibe",
      detail: "10% de descuento en tu primera recarga",
      sticky: true,
    });

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div style={{display: 'flex', alignItems: 'center'}}>
          <img
            alt={option.name}
            src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
            style={{ width: "18px", marginRight: "5px" }}
          />
          <div>{option.name}</div>
        </div>
      );
    }

    return <span>{props.placeholder}</span>;
  };

  const countryOptionTemplate = (option) => {
    return (
      <div style={{display: 'flex', alignItems: 'center'}}>
        <img
          alt={option.name}
          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
          style={{ width: "18px", marginRight: "5px" }}
        />
        <div>{option.name}</div>
      </div>
    );
  };

  const handleChange = (e) => {
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.value; 
    console.log(selectedCountry);
    
    setCountry(selectedCountry); 
    setDataUser({...dataUser, country: selectedCountry.name }); 
};

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(dataUser);
    
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

  useEffect(() => {
     setPrefix(getPrefixCountry(dataUser.country));
  }, [dataUser.country]);

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
              name="username"
              value={dataUser.username}
              onChange={handleChange}
              required
            />
            <label htmlFor="country">País</label>
            <Dropdown
              value={country}
              options={countries}
              optionLabel="name"
              placeholder="Seleccione un país"
              required
              style={{ width: "100%", marginBottom: "10px", height: "48px"  }}
              onChange={handleCountryChange}
              filter
              valueTemplate={selectedCountryTemplate}
              itemTemplate={countryOptionTemplate}
            />
            <label htmlFor="phone">Numero de Telefono</label>
            <div className="inputs-numbers">
            <InputText
            className="input-prefix"
              type="text"
              value={prefix}
              disabled
            />
            <InputText
              type="text"
              name="phone"
              value={dataUser.phone}
              onChange={handleChange}
              required
            />
            </div>
            <label htmlFor="email">Correo Electrónico</label>
            <InputText
              type="email"
              name="email"
              value={dataUser.email}
              onChange={handleChange}
              required
            />
            <label htmlFor="password">Contraseña</label>
            <InputText
              type="password"
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
              <Link
                style={{
                  color: "#2f73f1",
                  cursor: "pointer",
                  textDecoration: "none",
                }}
                to="/login"
              >
                inicia sesión
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterSeller;
