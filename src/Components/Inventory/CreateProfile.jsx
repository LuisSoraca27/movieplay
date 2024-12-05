import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useDispatch, useSelector } from "react-redux";
import { createProfileThunk } from "../../features/user/profileSlice";
import "../../style/inventory.css";
import useErrorHandler from "../../Helpers/useErrorHandler";
import { Toast } from "primereact/toast";
import { optionsCategory } from "../../utils/functions/selectNameCategoryOptions";

const CreateProfile = ({ show, onClose, reCharge }) => {
  const toast = useRef(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [selectedOption, setSelectedOption] = useState("");
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);
  const handleErrors = useErrorHandler(error, success);
  const footerContent = (
    <div>
      <Button
        type="button"
        label="Confirmar"
        icon="pi pi-check"
        onClick={() => onSubmit()}
        autoFocus
        severity="success"
      />
    </div>
  );

  const onSubmit = handleSubmit((data) => {
    const dataProfile = {
      ...data,
      categoryId: selectedOption.code,
    };
    console.log(selectedOption);
    
    dispatch(createProfileThunk(dataProfile)).then(() => {
      onClose();
      reset();
      reCharge();
    });
  });

  useEffect(() => {
    handleErrors(toast.current);
  }, [error, success]);

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={show}
        onHide={onClose}
        modal
        style={{ width: "50vw" }}
        header={`Crear ${selectedOption === "11" ? "IPTV" : "Perfil"}`}
        footer={footerContent}
      >
        <form style={{ textAlign: "start", width: "100%" }}>
          <div className="container-form-combos">
            <div className="colum-form-1">
              <div style={{ width: "100%" }}>
                <label htmlFor="categoryId" className="style-label">
                  Plataforma
                </label>
                <Dropdown
                  optionLabel="name"
                  value={selectedOption}
                  name="categoryId"
                  id="categoryId"
                  {...register("categoryId", { required: true })}
                  options={optionsCategory}
                  onChange={(e) => setSelectedOption(e.value)}
                  placeholder="Selecciona una plataforma"
                  style={{ width: "100%" }}
                />
              </div>
              <br />
              <div style={{ width: "100%" }}>
                <label htmlFor="name">Nombre</label>
                <InputText
                  type="text"
                  className={`${errors.name ? "p-invalid" : ""}`}
                  name="name"
                  {...register("name", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.name && (
                  <small id="username-help">Campo requerido</small>
                )}
              </div>

              <br />

              <div style={{ width: "100%" }}>
                <label htmlFor="description" className="style-label">
                  Descripción
                </label>
                <InputText
                  type="text"
                  className={`${errors.description ? "p-invalid" : ""}`}
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

              <div style={{ width: "100%" }}>
                <label htmlFor="price" className="style-label">
                  Precio
                </label>
                <InputText
                  type="number"
                  className={`form-control  form-control-lg ${
                    errors.price ? "p-invalid" : ""
                  }`}
                  name="price"
                  {...register("price", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.price && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>
              <br />
              <div style={{ width: "100%" }}>
                <label htmlFor="durationOfService" className="style-label">
                  Duración del servicio
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
            </div>

            <div className="colum-form-2">
              <div style={{ width: "100%" }}>
                <label htmlFor="emailAccount" className="style-label">
                  {selectedOption === "11" ? "Nombre IPTV" : "Correo de cuenta"}
                </label>
                <InputText
                  type="text"
                  className={`form-control  form-control-lg ${
                    errors.emailAccount ? "p-invalid" : ""
                  }`}
                  name="emailAccount"
                  {...register("emailAccount", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.emailAccount && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>

              <br />

              <div style={{ width: "100%" }}>
                <label htmlFor="passwordAccount" className="style-label">
                  {selectedOption === "11" ? "Usuario" : "Contraseña de cuenta"}
                </label>
                <InputText
                  type="password"
                  className={`form-control form-control-lg ${
                    errors.passwordAccount ? "is-invalid" : ""
                  }`}
                  name="passwordAccount"
                  {...register("passwordAccount", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.passwordAccount && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>

              <br />

              <div style={{ width: "100%" }}>
                <label htmlFor="profileAccount" className="style-label">
                  {selectedOption === "11" ? "Contraseña" : "Perfil de cuenta"}
                </label>
                <InputText
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.profileAccount ? "p-invalid" : ""
                  }`}
                  name="profileAccount"
                  {...register("profileAccount", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.profileAccount && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>

              <br />

              <div style={{ width: "100%" }}>
                <label htmlFor="pincodeAccount" className="style-label">
                  {selectedOption === "11" ? "URL" : "Pin de perfil"}
                </label>
                <InputText
                  type="text"
                  className={`form-control form-control-lg ${
                    errors.pincodeAccount ? "p-invalid" : ""
                  }`}
                  name="pincodeAccount"
                  {...register("pincodeAccount", { required: true })}
                  style={{ width: "100%" }}
                />
                {errors.pincodeAccount && (
                  <small className="invalid-feedback">Campo requerido</small>
                )}
              </div>
              <br />
            </div>
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default CreateProfile;
