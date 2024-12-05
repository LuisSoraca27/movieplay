import React, { useEffect, useRef } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { createUserThunk } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import useErrorHandler from "../Helpers/useErrorHandler";
import { Toast } from "primereact/toast";

// eslint-disable-next-line react/prop-types
const ModalCreateUser = ({ open, onClose }) => {
  const initialData = {
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "",
    country: "",
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
  const [dataUser, setDataUser] = React.useState(initialData);
  const [loading, setLoading] = React.useState(false);
  const [country, setCountry] = React.useState(null);
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);
  const handleError = useErrorHandler(error, success);

  const selectedCountryTemplate = (option, props) => {
    if (option) {
      return (
        <div style={{ display: "flex", alignItems: "center" }}>
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
      <div style={{ display: "flex", alignItems: "center" }}>
        <img
          alt={option.name}
          src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
          style={{ width: "18px", marginRight: "5px" }}
        />
        <div>{option.name}</div>
      </div>
    );
  };

  const handleCountryChange = (e) => {
    const selectedCountry = e.value; 
    console.log(selectedCountry);
    
    setCountry(selectedCountry); 
    setDataUser({...dataUser, country: selectedCountry.name }); 
};


  const handleChange = (e) => {
    setDataUser({
      ...dataUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    dispatch(createUserThunk(dataUser)).then(() => {
      setLoading(false);
      onClose();
      setDataUser(initialData);
    });
  };

  useEffect(() => {
    handleError(toast.current);
  }, [error, success]);

  return (
    <>
      <Toast ref={toast} />
      <Dialog
        visible={open}
        onHide={onClose}
        className="p-fluid"
        header="Crear usuario"
        footer={
          <div>
            <Button
              label="Crear usuario"
              icon="pi pi-check"
              className="p-button-success"
              onClick={handleSubmit}
              loading={loading}
              disabled={loading}
            />
          </div>
        }
      >
        <div style={{ padding: "20px" }}>
          <div className="flex flex-column gap-2">
            <label htmlFor="username">Nombre de usuario</label>
            <InputText
              id="username"
              aria-describedby="username-help"
              name="username"
              onChange={handleChange}
              value={dataUser.username}
            />
          </div>
          <br />
          <div className="p-field">
            <label htmlFor="email">Correo electrónico</label>
            <InputText
              id="email"
              name="email"
              onChange={handleChange}
              value={dataUser.email}
              required
            />
          </div>
          <br />
          <div className="p-field">
            <label htmlFor="password">Contraseña</label>
            <InputText
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              value={dataUser.password}
              required
            />
          </div>
          <br />
          <div>
            <label htmlFor="country">País</label>
            <Dropdown
              value={country}
              options={countries}
              optionLabel="name"
              placeholder="Seleccione un país"
              required
              style={{ width: "100%", marginBottom: "10px", height: "44px" }}
              onChange={handleCountryChange}
              filter
              valueTemplate={selectedCountryTemplate}
              itemTemplate={countryOptionTemplate}
            />
          </div>
          <div className="p-field">
            <label htmlFor="phone">Numero de Whatsapp</label>
            <InputText
              id="phone"
              name="phone"
              type="phone"
              onChange={handleChange}
              value={dataUser.phone}
              required
            />
          </div>
          <br />
          <div className="p-field">
            <label htmlFor="role">Selecciona el Rol del usuario</label>
            <Dropdown
              id="role"
              name="role"
              options={[
                { label: "Vendedor", value: "seller" },
                { label: "Administrador", value: "admin" },
              ]}
              onChange={handleChange}
              value={dataUser.role}
              placeholder="Selecciona el rol"
            />
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default ModalCreateUser;
