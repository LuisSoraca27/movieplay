import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { useDispatch } from "react-redux";
import "../../style/outlay.css";
import { updateCustomer } from "../../features/customer/customerSlice";

function EditCustomer({ show, onHide, dataEdit }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      fullName: dataEdit.fullName || "",
      email: dataEdit.email || "",
      phone: dataEdit.phone || "",
    },
  });

  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = (data) => {
    setLoading(true);
    console.log(data);

    dispatch(updateCustomer(dataEdit.id, data)).then(() => {
      onHide();
      setLoading(false);
    });
  };

  const fullNameValue = watch("fullName");
  const emailValue = watch("email");
  const phoneValue = watch("phone");

  useEffect(() => {
    if (dataEdit) {
      setValue("fullName", dataEdit.fullName);
      setValue("email", dataEdit.email);
      setValue("phone", dataEdit.phone);
    }
  }, [dataEdit, setValue]);

  return (
    <>
      <Dialog
        header="Editar cliente"
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
          className="container-edit-outlay"
        >
          <div>
            <label className="outlay-label">Nombre del cliente</label>
            <InputText
              className="outlay-input"
              value={fullNameValue}
              {...register("fullName", {
                required: "Este campo es obligatorio",
              })}
              onChange={(e) => setValue("fullName", e.target.value)}
            />
            {errors.fullName && (
              <Message
                severity="error"
                text={errors.fullName.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div>
            <label className="outlay-label">Correo</label>
            <InputText
              className="outlay-input"
              value={emailValue}
              {...register("email", {
                required: "Este campo es obligatorio",
                validate: (value) => validateEmail(value) || "Email inválido",
              })}
              onChange={(e) => setValue("email", e.target.value)}
            />
            {errors.email && (
              <Message
                severity="error"
                text={errors.email.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
          <div style={{ width: "100%" }}>
            <label className="outlay-label">Número de Teléfono</label>
            <InputText
              className="outlay-input"
              value={phoneValue}
              {...register("phone", {
                required: "Este campo es obligatorio",
              })}
              onChange={(e) => setValue("phone", e.target.value)}
            />
            {errors.phone && (
              <Message
                severity="error"
                text={errors.phone.message}
                style={{ position: "relative", top: "-10px" }}
              />
            )}
          </div>
        </form>
      </Dialog>
    </>
  );
}

export default EditCustomer;
