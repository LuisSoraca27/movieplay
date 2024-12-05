import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Message } from "primereact/message";
import formatDateForDB from "../../utils/functions/formatDateForDB";
import { createOutlay } from "../../features/outlay/OutlaySlice";
import { useDispatch } from "react-redux";
import "../../style/outlay.css";

// eslint-disable-next-line react/prop-types
function CreateOutlay({ show, onHide, searchDate }) {
  const mediosDePago = [
    { label: "Bancolombia", value: "bancolombia" },
    { label: "Nequi", value: "nequi" },
    { label: "Daviplata", value: "Daviplata" },
    { label: "Ahorro a la mano", value: "ahorro a la mano" },
    { label: "Transfiya", value: "transfiya" },
    { label: "Pse", value: "pse" },
    { label: "Binace", value: "binance" },
    { label: "PayPal", value: "paypal" },
    { label: "Corresponsal", value: "Corresponsal" },
    { label: "Efectivo", value: "Efectivo" },
  ];

  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      name: "",
      amount: "",
      type: "",
      status: "",
      paymentMethod: "",
      referend: "",
      creationDate: new Date(),
    },
  });

  const [loading, setLoading] = useState(false);

  const onSubmit = (data) => {
    console.log(data);
    
    const formatedData = {
      ...data,
      creationDate: formatDateForDB(data.creationDate),
    };
    setLoading(true);
    dispatch(createOutlay(formatedData, searchDate)).then(() => {
      setValue("name", "");
      setValue("amount", "");
      setValue("type", "");
      setValue("status", "");
      setValue("creationDate", new Date());
      onHide();
      setLoading(false);
    });
  };

  const nameValue = watch("name");
  const amountValue = watch("amount");
  const typeValue = watch("type");
  const paymentMethodValue = watch("paymentMethod");
  const referendValue = watch("referend");
  const statusValue = watch("status");
  const creationDateValue = watch("creationDate");

  useEffect(() => {
    if (!creationDateValue) {
      setValue("creationDate", new Date());
    }
  }, [creationDateValue, setValue]);

  const typeOutlay = [
    { label: "Nomina", value: "nomina" },
    { label: "Pago a proveedores", value: "pago a proveedores" },
    { label: "Inventario", value: "inventario" },
    { label: "Otros", value: "otros" },
  ];

  const statusOutlay = [
    { label: "Pagado", value: "pagado" },
    { label: "Pendiente", value: "pendiente" },
  ];

  return (
    <>
      <Dialog
        header="Crear gasto"
        visible={show}
        onHide={onHide}
        style={{ width: "350px" }}
        footer={
          <div>
            <Button
              label="Confirmar"
              icon="pi pi-check"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
              disabled={loading}
              severity="success"
            />
          </div>
        }
      >
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="container-create-outlay"
        >
          <div>
            <label className="outlay-label">Nombre del gasto</label>
            <InputText
              className="outlay-input"
              value={nameValue}
              {...register("name", { required: "Este campo es obligatorio" })}
              onChange={(e) => setValue("name", e.target.value)}
            />
            {errors.name && (
              <Message
                severity="error"
                text={errors.name.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div>
            <label className="outlay-label">Monto</label>
            <InputText
              className="outlay-input"
              value={amountValue}
              {...register("amount", {
                required: "Este campo es obligatorio",
                pattern: {
                  value: /^[0-9]+(\.[0-9]{1,2})?$/,
                  message: "Debe ser un número válido",
                },
              })}
              onChange={(e) => setValue("amount", e.target.value)}
            />
            {errors.amount && (
              <Message
                severity="error"
                text={errors.amount.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div style={{ width: "100%" }}>
            <label className="outlay-label">Tipo de gasto</label>
            <Dropdown
              className="outlay-input"
              options={typeOutlay}
              value={typeValue}
              placeholder="Seleccione un tipo"
              onChange={(e) => setValue("type", e.value)}
            />
            <input
              type="hidden"
              {...register("type", { required: "Seleccione un tipo de gasto" })}
              value={typeValue}
            />
            {errors.type && (
              <Message
                severity="error"
                text={errors.type.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div style={{ width: "100%" }}>
            <label className="outlay-label">Medio de pago</label>
            <Dropdown
              className="outlay-input"
              options={mediosDePago}
              value={paymentMethodValue}
              placeholder="Seleccione un medio de pago"
              onChange={(e) => setValue("paymentMethod", e.value)}
            />
            <input
              type="hidden"
              {...register("paymentMethod", { required: "Seleccione un tipo de gasto" })}
              value={typeValue}
            />
            {errors.paymentMethod && (
              <Message
                severity="error"
                text={errors.paymentMethod.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div>
            <label className="outlay-label">Referencia de pago</label>
            <InputText
              className="outlay-input"
              value={referendValue}
              {...register("referend", { required: "Este campo es obligatorio" })}
              onChange={(e) => setValue("referend", e.target.value)}
            />
            {errors.name && (
              <Message
                severity="error"
                text={errors.name.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div style={{ width: "100%" }}>
            <label className="outlay-label">Estado</label>
            <Dropdown
              className="outlay-input"
              options={statusOutlay}
              value={statusValue}
              placeholder="Seleccione un estado"
              style={{ width: "100%" }}
              onChange={(e) => setValue("status", e.value)}
            />
            <input
              type="hidden"
              {...register("status", { required: "Seleccione un estado" })}
              value={statusValue}
            />
            {errors.status && (
              <Message
                severity="error"
                text={errors.status.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div style={{ width: "100%" }}>
            <label className="outlay-label">Fecha de creación</label>
            <Calendar
              className="outlay-input"
              showIcon
              dateFormat="dd/mm/yy"
              hourFormat="24"
              showTime={false}
              value={creationDateValue}
              placeholder="Fecha de creación"
              onChange={(e) => setValue("creationDate", e.value)}
            />
            {errors.creationDate && (
              <Message
                severity="error"
                text={errors.creationDate.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default CreateOutlay;