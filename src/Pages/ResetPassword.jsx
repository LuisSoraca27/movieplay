import { useState, useRef } from "react";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { InputOtp } from "primereact/inputotp";
import dksoluciones from "../api/config";
import { Toast } from "primereact/toast";
import Swal from "sweetalert2";
import { Link, useNavigate } from "react-router-dom";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
    otp: "",
  });
  const [touched, setTouched] = useState({
    password: false,
    confirmPassword: false,
    otp: false,
  });
  const [render, setRender] = useState(true);

  const toast = useRef(null);
  const Navigate = useNavigate();

  const submitOtp = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await dksoluciones.post("/user/validcodereset", {
        code: otp,
      });
      if (res.status === 200) {
        setRender(false);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: "Lo sentimos",
        detail: "Codigo invalido",
        life: 5000,
      });
    }
  };

  const validatePassword = (value) => {
    if (!value) {
      return "La contraseña es requerida";
    }
    if (value.length < 8) {
      return "La contraseña debe tener al menos 8 caracteres";
    }
    if (!/[A-Z]/.test(value)) {
      return "La contraseña debe tener al menos una mayúscula";
    }
    if (!/[0-9]/.test(value)) {
      return "La contraseña debe tener al menos un número";
    }
    return "";
  };

  const validateConfirmPassword = (value) => {
    if (!value) {
      return "La confirmación de contraseña es requerida";
    }
    if (value !== password) {
      return "Las contraseñas no coinciden";
    }
    return "";
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
      confirmPassword:
        value !== confirmPassword ? "Las contraseñas no coinciden" : "",
    }));
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    setTouched((prev) => ({ ...prev, confirmPassword: true }));
    setErrors((prev) => ({
      ...prev,
      confirmPassword: validateConfirmPassword(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({
      password: true,
      confirmPassword: true,
      otp: true,
    });

    if (render) {
      if (password.length !== 6) {
        setErrors((prev) => ({
          ...prev,
          otp: "El código debe tener 6 dígitos",
        }));
        return;
      }
    } else {
      const passwordError = validatePassword(password);
      const confirmError = validateConfirmPassword(confirmPassword);

      if (passwordError || confirmError) {
        setErrors({
          ...errors,
          password: passwordError,
          confirmPassword: confirmError,
        });
        return;
      }
    }

    setLoading(true);
    try {
      const res = await dksoluciones.post("/user/resetpassword", {
        password: password,
        code: otp,
      });
      if (res.status === 200) {
        Swal.fire({
          title: "Contraseña restablecida",
          text: "Tu contraseña ha sido restablecida exitosamente",
          icon: "success",
          confirmButtonText: "Aceptar",
        }).then(() => {
          Navigate("/login");
        });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      toast.current.show({
        severity: "error",
        summary: "Lo sentimos",
        detail: "Ocurrio un error",
        life: 5000,
      });
    }
  };

  const renderResetPassword = () => {
    if (!render) {
      return (
        <>
          <h2>Restablecer contraseña</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="password">Nueva contraseña</label>
              <Password
                id="password"
                name="password"
                value={password}
                className={
                  errors.password && touched.password ? "p-invalid" : ""
                }
                placeholder="Ingresa tu nueva contraseña"
                onChange={handlePasswordChange}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, password: true }))
                }
                toggleMask
                feedback={false}
                style={{ width: "100%", display: "block" }}
              />
              {errors.password && touched.password && (
                <small className="p-error block mt-2">{errors.password}</small>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirmar contraseña</label>
              <Password
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                className={
                  errors.confirmPassword && touched.confirmPassword
                    ? "p-invalid"
                    : ""
                }
                placeholder="Confirma tu nueva contraseña"
                onChange={handleConfirmPasswordChange}
                onBlur={() =>
                  setTouched((prev) => ({ ...prev, confirmPassword: true }))
                }
                feedback={false}
                toggleMask
                style={{ width: "100%", display: "block" }}
              />
              {errors.confirmPassword && touched.confirmPassword && (
                <small className="p-error block mt-2">
                  {errors.confirmPassword}
                </small>
              )}
            </div>
            <Button
              type="submit"
              label="Restablecer"
              className="p-button-rounded"
              severity="success"
              loading={loading}
              disabled={
                loading ||
                (touched.password && errors.password) ||
                (touched.confirmPassword && errors.confirmPassword)
              }
            />
          </form>
          <p style={{ fontWeight: 500, textAlign: "center" }}>
            Volver a{" "}
            <Link
              style={{
                color: "#2f73f1",
                cursor: "pointer",
                textDecoration: "none",
              }}
              to="/login"
            >
              Iniciar sesión
            </Link>
          </p>
        </>
      );
    } else {
      return (
        <>
          <h2>Codigo de verificación</h2>
          <p>
            Recibiste un codigo de 6 digitos por correo electrónico, por favor
            ingresalo
          </p>
          <form onSubmit={submitOtp}>
            <InputOtp
              value={otp}
              onChange={(e) => setOtp(e.value)}
              numInputs={6}
              length={6}
              integerOnly
              className={errors.otp && touched.otp ? "p-invalid" : ""}
              onBlur={() => setTouched((prev) => ({ ...prev, otp: true }))}
            />
            {errors.otp && touched.otp && (
              <small className="p-error block mt-2">{errors.otp}</small>
            )}
            <Button
              type="submit"
              label="Verificar"
              className="p-button-rounded"
              severity="success"
              loading={loading}
              disabled={loading || otp.length !== 6}
            />
          </form>
          <p style={{ fontWeight: 500, textAlign: "center" }}>
            Volver a{" "}
            <Link
              style={{
                color: "#2f73f1",
                cursor: "pointer",
                textDecoration: "none",
              }}
              to="/login"
            >
              Iniciar sesión
            </Link>
          </p>
        </>
      );
    }
  };

  return (
    <>
      <Toast ref={toast} />
      <div className="containerLogin">
        <div className="login-container">{renderResetPassword()}</div>
      </div>
    </>
  );
}

export default ResetPassword;
