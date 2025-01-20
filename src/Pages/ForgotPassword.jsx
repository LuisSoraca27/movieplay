import "../style/login.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { useState, useRef } from "react";
import dksoluciones from "../api/config";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

    const Navigate = useNavigate();
    const toast = useRef(null);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    setTouched(true);
    
    if (!value) {
      setError("El correo electrónico es requerido");
    } else if (!validateEmail(value)) {
      setError("Por favor ingresa un correo electrónico válido");
    } else {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched(true);

    if (!email) {
      setError("El correo electrónico es requerido");
      return;
    }

    if (!validateEmail(email)) {
      setError("Por favor ingresa un correo electrónico válido");
      return;
    }

    setLoading(true);
    console.log(email);
    try {
    const res = await dksoluciones.post("/user/forgotpassword", { email });
      if(res.status === 200){
        Navigate("/reset-password");
      }
    } catch (error) {
        console.log(error);
        setLoading(false);
        toast.current.show({ severity: "error", summary: "Correo invalido", detail: "No se pudo enviar el correo electrónico" });
    }
  };

  return (
    <>
        <Toast ref={toast} />
      <div className="containerLogin">
        <div className="forgot-container">
          <h2 style={{ fontWeight: 600, color: "#2a2a2a" }}>
            ¿Olvidaste tu contraseña?
          </h2>
          <p style={{ fontWeight: 500, color: "#333333", fontSize: "18px" }}>
            Ingresa tu correo electrónico para recuperar tu contraseña
          </p>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <InputText
                type="email"
                id="email"
                value={email}
                className={error && touched ? "p-invalid" : ""}
                placeholder="Tu correo"
                onChange={handleChange}
                onBlur={() => setTouched(true)}
              />
              {error && touched && (
                <small className="p-error block mt-2">{error}</small>
              )}
            </div>
            <Button
              label="Recuperar contraseña"
              className="p-button-rounded"
              severity="secondary"
              loading={loading}
              disabled={loading || (touched && error)}
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
        </div>
      </div>
    </>
  );
}

export default ForgotPassword;