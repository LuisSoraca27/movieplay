import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { createAccountThunk } from "../../features/account/accountSlice";
import { useDispatch, useSelector } from "react-redux";
import useErrorHandler from "../../Helpers/useErrorHandler";
import { Toast } from "primereact/toast";
import "../../style/inventory.css";

const CreateAccount = ({ show, onClose, reCharge }) => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [selectedOption, setSelectedOption] = useState("");
  const handleError = useErrorHandler(error, success);
  const toast = useRef(null);

  const footerContent = (
    <div>
      <Button
        type="submit"
        label="Confirmar"
        icon="pi pi-check"
        onClick={() => onSubmit()}
        autoFocus
        severity="success"
      />
    </div>
  );

  const onSubmit = handleSubmit((data) => {
    const dataAccount = {
      ...data,
      categoryId: selectedOption,
    };

    dispatch(createAccountThunk(dataAccount)).then(() => {
      onClose();
      reset();
      reCharge();
    });
  });

  useEffect(() => {
    handleError(toast.current);
  }, [error, success]);

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={show}
        onHide={onClose}
        modal
        style={{ width: "50vw" }}
        header="Crear Cuenta"
        footer={footerContent}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="container-form-combos">
            <div className="colum-form-1">
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label htmlFor="categoryId" className="style-label">
                  Plataforma
                </label>
                <Dropdown
                  className={` ${errors.categoryId ? "p-invalid" : ""}`}
                  name="categoryId"
                  options={[
                    { name: "Netflix", code: "2" },
                    { name: "Max Premium", code: "3" },
                    { name: "Max Estándar", code: "17" },
                    { name: "Disney+ Premium", code: "4" },
                    { name: "Disney+ Estándar", code: "15" },
                    { name: "Disney+ Basico", code: "16" },
                    { name: "Amazon Prime Video", code: "1" },
                    { name: "Paramount+", code: "5" },
                    { name: "Vix+", code: "6" },
                    { name: "Plex", code: "7" },
                    { name: "Crunchyroll", code: "8" },
                    { name: "Black Code", code: "9" },
                    { name: "Iptv", code: "10" },
                    { name: "Rakuten Viki", code: "13" },
                    { name: "Flujo TV", code: "14" },
                    { name: "Youtube Premium", code: "11" },
                    { name: "Spotify", code: "12" },
                    { name: "Tidal", code: "18" },
                    { name: "Mubi", code: "19" },
                    { name: "Canva", code: "20" },
                    { name: "Universal+", code: "21" },
                    { name: "Duolingo", code: "22" },
                    { name: "Microsoft 365", code: "23" },
                    { name: "McAfee", code: "24" },
                    { name: "TvMia", code: "25" },
                    { name: "DirectTv GO", code: "26" },
                    { name: "Apple Tv", code: "27" },
                  ]}
                  {...register("categoryId", { required: true })}
                  value={selectedOption}
                  onChange={(e) => setSelectedOption(e.value)}
                  style={{ width: "100%" }}
                  placeholder="Selecciona una plataforma"
                />
                {errors.categoryId && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>
              <br />
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label htmlFor="name" className="style-label">
                  Nombre
                </label>
                <InputText
                  type="text"
                  className={` ${errors.name ? "p-invalid" : ""}`}
                  name="name"
                  {...register("name", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.name && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>
              <br />
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label htmlFor="description" className="style-label">
                  Descripción
                </label>
                <InputTextarea
                  rows={3}
                  type="text"
                  className={` ${errors.description ? "p-invalid" : ""}`}
                  name="description"
                  {...register("description", {
                    required: true,
                    maxLength: 230,
                  })}
                  style={{ width: "100%" }}
                />
                {errors.description &&
                  errors.description.type === "required" && (
                    <small className="invalid-feedback">Campo requerido</small>
                  )}
                {errors.description &&
                  errors.description.type === "maxLength" && (
                    <small className="invalid-feedback">
                      La descripción debe tener como máximo 230 caracteres
                    </small>
                  )}
              </div>
              <br />
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label htmlFor="price" className="style-label">
                  Precio
                </label>
                <InputText
                  type="number"
                  className={` ${errors.price ? "p-invalid" : ""}`}
                  name="price"
                  {...register("price", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.price && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>
            </div>

            <div className="colum-form-2">
              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label htmlFor="durationOfService" className="style-label">
                  Dias de servicio
                </label>
                <InputText
                  type="number"
                  className={` ${errors.durationOfService ? "p-invalid" : ""}`}
                  name="durationOfService"
                  {...register("durationOfService", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.durationOfService && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>

              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label htmlFor="emailAccount" className="style-label">
                  {selectedOption === "11" ? "Nombre IPTV" : "Correo de cuenta"}
                </label>
                <InputText
                  type="text"
                  className={` ${errors.emailAccount ? "p-invalid" : ""}`}
                  name="emailAccount"
                  {...register("emailAccount", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.emailAccount && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>

              <div style={{ width: "100%", marginBottom: "20px" }}>
                <label htmlFor="passwordAccount" className="style-label">
                  {selectedOption === "11" ? "Usuario" : "Contraseña de cuenta"}
                </label>
                <InputText
                  type={selectedOption === "11" ? "text" : "password"}
                  className={` ${errors.passwordAccount ? "p-invalid" : ""}`}
                  name="passwordAccount"
                  {...register("passwordAccount", { required: true })}
                  style={{ width: "100%" }}
                  placeholder={
                    selectedOption === "11" ? "Usuario" : "Contraseña de cuenta"
                  }
                />
                {errors.passwordAccount && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>
            </div>
            <div></div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateAccount;
