/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { Dialog } from "primereact/dialog";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import "../../style/inventory.css";
import "../../style/RegisterOrder.css";
import "../../style/modalProfile.css";
import { Button } from "primereact/button";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerByEmail } from "../../features/customer/customerSlice";
import { Toast } from "primereact/toast";
import getCurrentDate from "../../utils/functions/getCurrentDate";
import { createOrderInternalProfile, setOrderStatusError, setOrderStatusSuccess } from "../../features/ordersInternal/ordersIternalSlice";
import CardProfile from "../CardProfile";
import { setProfilesThunk } from "../../features/user/profileSlice";
import { setAccountsThunk } from "../../features/account/accountSlice";
import { removeError, removeSuccess } from "../../features/error/errorSlice";
import useErrorHandler from "../../Helpers/useErrorHandler"
import Swal from "sweetalert2";

function RegisterOrder({ onClose, data, typeAccountProp }) {
  
  const stepRef = useRef(null);
  const toast = useRef(null);
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    reset,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      referend: "",
    },
  });

  const [profileSelected, setProfileSelected] = useState(null);
  const [typeAccount, setTypeAccount] = useState(typeAccountProp);
  const [options, setOptions] = useState([]);

  const { profiles } = useSelector((state) => state.profiles);
  const { accounts } = useSelector((state) => state.accounts);
  const { customerByEmail } = useSelector((state) => state.customers);
 const { orderStatusError, orderStatusSuccess } = useSelector((state) => state.ordersInternal);
  const { error, success } = useSelector((state) => state.error);
  const handleErrors = useErrorHandler(error, success);
  
  const fullNameValue = watch("fullName");
  const emailValue = watch("email");
  const phoneValue = watch("phone");
  const typeValue = watch("type");
  const referendValue = watch("referend");

  const mediosDePago = [
    { label: "Bancolombia", value: "bancolombia" },
    { label: "Nequi", value: "nequi" },
    { label: "Daviplata", value: "Daviplata" },
    { label: "Ahorro a la mano", value: "ahorro a la mano" },
    { label: "Qr Bancolombia", value: "qr bancolombia" },
    { label: "Transfiya", value: "transfiya" },
    { label: "Pse", value: "pse" },
    { label: "Binace", value: "´binance" },
    { label: "PayPal", value: "paypal" },
    { label: "Wompi", value: "wompi" },
    { label: "Efectivo", value: "Efectivo" },
  ];

  const handlerErrors = () => {
    if (orderStatusError) {
      Swal.fire({
        icon: "error",
        title: "Lo sentimos",
        text: orderStatusError,
      });
      dispatch(setOrderStatusError(false));
    }
    if (orderStatusSuccess) {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: orderStatusSuccess,
      });
      dispatch(setOrderStatusSuccess(false));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSearchCustomerByEmail = () => {
    if (fullNameValue && phoneValue) {
      setValue("fullName", "");
      setValue("phone", "");
    }
    dispatch(getCustomerByEmail(emailValue));
  };

  const handleSelect = (e) => {
    const Id = e.target.value;
    const selected = options.find((profile) => profile.id === Id);
    setProfileSelected(selected);
  };

  const onSubmit = (data) => {
    stepRef.current.nextCallback();

    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("referend", data.referend.toLowerCase());
    formData.append("paymentMethod", data.type);
    formData.append("profileSelected", profileSelected.id);
    formData.append("typeAccount", typeAccount);
    formData.append("lastPurchaseDate", getCurrentDate());

    dispatch(createOrderInternalProfile(formData)).then(() => {
      reset();
      onClose();
    })
  };

  useEffect(() => {
    handleErrors(toast.current);
  }, [error, success]);

  useEffect(() => {
    handlerErrors();
  }, [orderStatusError, orderStatusSuccess]);

  useEffect(() => {
    if (customerByEmail) {
      setValue("fullName", customerByEmail.fullName);
      setValue("phone", customerByEmail.phone);
      setValue("type", customerByEmail.type);
    }
  }, [customerByEmail]);

  useEffect(() => {
    if (typeAccount === "profile") {
      dispatch(setProfilesThunk(data?.categoryName));
    } else if (typeAccount === "account") {
      dispatch(setAccountsThunk(data?.categoryName));
    }
  }, []);

  useEffect(() => {
    if (typeAccount === "profile") {
      setOptions(profiles);  // Si es "profile", cargamos los perfiles
    } else if (typeAccount === "account") {
      setOptions(accounts);  // Si es "account", cargamos las cuentas
    }
  }, [typeAccount, profiles, accounts]);

  return (
    <>
      <Dialog
        header="Registrar venta"
        visible={data.total > 0 ? data.open : false}
        className="dialog-register-order"
        onHide={onClose}
      >
        <Stepper ref={stepRef} linear>
          <StepperPanel header="Producto" style={{ margin: "0", with: "100%" }}>
            <div className="container-product-register">
              <div className="product-register-info">
                <div className="container-img">
                  <CardProfile
                    total={data?.total}
                    img={data?.img}
                    title={data?.title}
                    background={data?.categoryName}
                  />
                </div>
                <div className="container-info-product">
                  <h2 className="title-card">{data?.title}</h2>
                  <p
                    style={{
                      fontSize: "17px",
                      fontWeight: "500",
                      margin: "5px",
                      color: "#2a2a2a",
                    }}
                  >
                    Por favor, seleccione un{" "}
                    {typeAccount === "profile" ? "perfil" : "cuenta"}
                  </p>
                  <div className="profile">
                    <Dropdown
                      value={profileSelected ? profileSelected.id : ""}
                      onChange={(e) => handleSelect(e)}
                      options={options.map((option) => ({
                        label: option.name,
                        value: option.id,
                      }))}
                      placeholder={
                        typeAccount === "profile"
                          ? "Seleccione un perfil"
                          : "Seleccione una cuenta"
                      }
                      className="dropdown_profile"
                      optionLabel="label"
                    />
                    {profileSelected && (
                      <div className="profile-value">
                        Valor Perfil seleccionado:{" "}
                        <strong>{profileSelected.price}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="buttons-next-prev">
                <span></span>
                <Button
                  icon="pi pi-arrow-right"
                  label="Continuar"
                  iconPos="right"
                  rounded
                  className="p-button-success"
                  onClick={() => stepRef.current.nextCallback()}
                />
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Datos del cliente y pago">
            <div className="container-product-register">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="product-register-info">
                  <div className="data-client">
                    <h3>Datos del cliente</h3>
                    <div className="container-input-email">
                      <FloatLabel style={{ width: "90%" }}>
                        <label>Correo</label>
                        <InputText
                          style={{ width: "100%" }}
                          value={emailValue}
                          className={`${errors.email && "p-invalid"}`}
                          {...register("email", {
                            required: "Este campo es obligatorio",
                            validate: (value) =>
                              validateEmail(value) || "Email inválido",
                          })}
                          onChange={(e) => setValue("email", e.target.value)}
                        />
                      </FloatLabel>
                      <Button
                        icon="pi pi-search"
                        className="p-button-success"
                        onClick={handleSearchCustomerByEmail}
                        disabled={!emailValue}
                        type="button"
                      />
                    </div>
                    <br />
                    <br />
                    <FloatLabel style={{ width: "100%" }}>
                      <label>Nombre del cliente</label>
                      <InputText
                        style={{ width: "100%" }}
                        value={fullNameValue}
                        className={`${errors.fullName && "p-invalid"}`}
                        {...register("fullName", {
                          required: "Este campo es obligatorio",
                        })}
                        onChange={(e) => setValue("fullName", e.target.value)}
                        autoComplete="new-password"
                        disabled={customerByEmail}
                      />
                    </FloatLabel>
                    <br />
                    <br />
                    <FloatLabel style={{ width: "100%" }}>
                      <label>Número de Teléfono</label>
                      <InputText
                        style={{ width: "100%" }}
                        value={phoneValue}
                        className={`${errors.phone && "p-invalid"}`}
                        {...register("phone", {
                          required: "Este campo es obligatorio",
                        })}
                        onChange={(e) => setValue("phone", e.target.value)}
                        autoComplete="new-password"
                        disabled={customerByEmail}
                      />
                    </FloatLabel>
                  </div>

                  <div className="data-pay">
                    <h3>Datos de transación</h3>
                    <div style={{ width: "100%", position: "relative" }}>
                      <Dropdown
                        style={{ width: "100%" }}
                        options={mediosDePago}
                        value={typeValue}
                        className={`${errors.type && "p-invalid"}`}
                        placeholder="Seleccione un medio de pago"
                        onChange={(e) => setValue("type", e.value)}
                      />
                      <input
                        type="hidden"
                        {...register("type", {
                          required: "Seleccione un tipo de gasto",
                        })}
                        value={typeValue}
                      />
                    </div>
                    <br />
                    <br />
                    <FloatLabel style={{ width: "100%" }}>
                      <label>Referencia de pago</label>
                      <InputText
                        style={{ width: "100%" }}
                        value={referendValue}
                        className={`${errors.referend && "p-invalid"}`}
                        {...register("referend", {
                          required: "Este campo es obligatorio",
                        })}
                        onChange={(e) => setValue("referend", e.target.value)}
                      />
                    </FloatLabel>
                  </div>
                </div>
                <div className="buttons-next-prev">
                  <Button
                    icon="pi pi-arrow-left"
                    label="retroceder"
                    iconPos="left"
                    rounded
                    className="p-button-success"
                    onClick={() => stepRef.current.prevCallback()}
                    type="button"
                  />
                  <Button
                    icon="pi pi-arrow-right"
                    label="Continuar"
                    iconPos="right"
                    rounded
                    className="p-button-success"
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </form>
            </div>
          </StepperPanel>
          <StepperPanel header="Entrega">
            <div className="spinner-entrega">
              <ProgressSpinner
                style={{ width: "200px", height: "200px" }}
                strokeWidth="2"
              />
              <p>Entregando...</p>
            </div>
          </StepperPanel>
        </Stepper>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
}

export default RegisterOrder;
