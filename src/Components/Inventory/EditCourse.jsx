import  { useEffect, useRef, useState } from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { editCourseThunk } from "../../features/course/courseSlice";
import useErrorHandler from "../../Helpers/useErrorHandler";
import { Toast } from "primereact/toast";

const EditCourse = ({ show, onClose, dataCourse, reCharge }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { success, error } = useSelector((state) => state.error);
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const handleErrors = useErrorHandler(error, success);
  const toast = useRef(null);

  const footerContent = (
    <div>
      <Button
        label="Confirmar"
        icon="pi pi-check"
        onClick={() => onSubmit()}
        autoFocus
        severity="success"
        loading={loading}
        disabled={loading}
      />
    </div>
  );

  const onSubmit = handleSubmit((data) => {
    setLoading(true);
    dispatch(editCourseThunk(data.id, data)).then(() => {
      onClose();
      reCharge();
      reset();
      setLoading(false);
    });
  });

  useEffect(() => {
    reset({
      ...dataCourse,
      price: parseInt(dataCourse.price),
    });
  }, [dataCourse, reset]);

  useEffect(() => {
    handleErrors(toast.current);
  }, [success, error]);

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        header="Editar Curso"
        visible={show}
        style={{ width: "380px", height: "85vh" }}
        onHide={() => onClose()}
        footer={footerContent}
      >
        <form style={{ width: "100%" }} onSubmit={onSubmit}>
          <div style={{ marginBottom: "20px", width: "100%" }}>
            <label
              htmlFor="price"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Nombre
            </label>
            <InputText
              id="Nombre"
              type="text"
              style={{ width: "100%" }}
              className={`p-inputtext-sm ${errors.name ? "p-invalid" : ""}`}
              {...register("name", {
                required: { value: true, message: "El nombre es requerido" },
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 240,
                  message: "El nombre debe tener menos de 240 caracteres",
                },
              })}
            />

            {errors.name && (
              <span style={{ color: "red", fontSize: "15px" }}>
                {errors.name.message}
              </span>
            )}
          </div>
          <div style={{ marginBottom: "5px", width: "100%" }}>
            <label
              htmlFor="price"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Descripción
            </label>
            <InputTextarea
              id="username"
              rows={5}
              cols={30}
              style={{ width: "100%" }}
              className={errors.description ? "p-invalid" : ""}
              {...register("description", {
                required: {
                  value: true,
                  message: "La descripción es requerida",
                },
                minLength: {
                  value: 3,
                  message: "La descripción debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 240,
                  message: "La descripción debe tener menos de 240 caracteres",
                },
              })}
            />
            {errors.description && (
              <span style={{ color: "red", fontSize: "15px" }}>
                {errors.description.message}
              </span>
            )}
          </div>
          <div
            style={{ marginTop: "5px", width: "100%" }}
            className="flex-auto"
          >
            <label
              htmlFor="price"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Precio
            </label>
            <InputText
              inputId="price"
              style={{ width: "100%" }}
              keyfilter="int"
              className={`p-inputtext-sm ${errors.price ? "p-invalid" : ""}`}
              {...register("price", {
                required: { value: true, message: "El precio es requerido" },
              })}
            />
            {errors.price && (
              <span style={{ color: "red", fontSize: "15px" }}>
                {errors.price.message}
              </span>
            )}
          </div>
          <div style={{ marginBottom: "5px", width: "100%" }}>
            <label
              htmlFor="linkCourse"
              style={{
                display: "block",
                marginBottom: "5px",
                fontWeight: "bold",
              }}
            >
              Link del curso
            </label>
            <InputText
              id="linkCourse"
              type="text"
              style={{ width: "100%" }}
              className={`p-inputtext-sm ${errors.name ? "p-invalid" : ""}`}
              {...register("linkCourse", {
                required: { value: true, message: "El nombre es requerido" },
                minLength: {
                  value: 3,
                  message: "El nombre debe tener al menos 3 caracteres",
                },
                maxLength: {
                  value: 240,
                  message: "El nombre debe tener menos de 240 caracteres",
                },
              })}
            />

            {errors.linkCourse && (
              <span style={{ color: "red", fontSize: "15px" }}>
                {errors.linkCourse.message}
              </span>
            )}
          </div>
        </form>
      </Dialog>
    </div>
  );
};

export default EditCourse;
