import { Dialog } from "primereact/dialog";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import "../../style/inventory.css";
import "../../style/RegisterOrder.css";
import { Button } from "primereact/button";
import { useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { FloatLabel } from "primereact/floatlabel";
import { Dropdown } from "primereact/dropdown";
import { ProgressSpinner } from "primereact/progressspinner";
import { useDispatch, useSelector } from "react-redux";
import { getCustomerByEmail } from "../../features/customer/customerSlice";
import useErrorHandler from "../../Helpers/useErrorHandler";
import { Toast } from "primereact/toast";
import getCurrentDate from "../../utils/functions/getCurrentDate";
import { createOrderInternal } from "../../features/ordersInternal/ordersIternalSlice";

function RegisterOrderByCombo({ show, onClose, product }) {
    
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

  const { error, success } = useSelector((state) => state.error);
  const handleErrors = useErrorHandler(error, success);

  const { customerByEmail } = useSelector((state) => state.customers);

  const image = product ? product?.imgCombos[0]?.urlImagen : null;

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
    { label: "Binace", value: "binance" },
    { label: "PayPal", value: "paypal" },
    { label: "Wompi", value: "wompi" },
    { label: "Efectivo", value: "Efectivo" },
  ];

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

  const onSubmit = (data) => {
    stepRef.current.nextCallback();

  
    const formData = new FormData();
    formData.append("fullName", data.fullName);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("referend", data.referend.toLowerCase());
    formData.append("productId", product?.id);
    formData.append("paymentMethod", data.type);
    formData.append("productName", product?.name);
    formData.append("productDescription", product?.description);
    formData.append("price", product?.price);
    formData.append("productPrice", product?.price);
    formData.append("categoriesCPs", JSON.stringify(product?.categoriesCPs));
    formData.append("lastPurchaseDate", getCurrentDate());

    dispatch(createOrderInternal(formData)).then(() => {
      reset();
      onClose();
    });
  };

  useEffect(() => {
    handleErrors(toast.current);
  }, [error, success]);

  useEffect(() => {
    if (customerByEmail) {
      setValue("fullName", customerByEmail.fullName);
      setValue("phone", customerByEmail.phone);
      setValue("type", customerByEmail.type);
    }
  }, [customerByEmail]);

  return (
    <>
      <Dialog
        header="Registrar venta"
        visible={show}
        className="dialog-register-order"
        onHide={onClose}
      >
        <Stepper ref={stepRef} linear>
          <StepperPanel header="Producto" style={{ margin: "0", with: "100%" }}>
            <div className="container-product-register">
              <div className="product-register-info">
                <div className="container-img-product">
                  <img src={image} alt={product?.name || "Producto"} />
                </div>
                <div className="container-info-product">
                  <h3 className="info-product-title">{product?.name}</h3>
                  <p className="info-product-description">
                    {product?.description}
                  </p>
                  <p className="info-product-price">${product?.price}</p>
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
                        style={{ width: "10%" }}
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

export default RegisterOrderByCombo;
