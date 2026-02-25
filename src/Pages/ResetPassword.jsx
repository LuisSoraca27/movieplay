import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import dksoluciones from "../api/config";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

// Importing Logos (Matching Login.jsx/ForgotPassword.jsx)
import netflix from "../assets/img/netflix.png";
import prime from "../assets/img/amazon_prime.png";
import hbo from "../assets/img/hbo_max.png";
import appletv from "../assets/img/apple_tv.png";
import hulu from "../assets/img/paramount-plus.png";

function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);

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

  const Navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

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
      addToast({
        title: "Error",
        description: error.response?.data?.message || "Código inválido",
        color: "danger",
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

  const handlePasswordChange = (value) => {
    setPassword(value);
    setTouched((prev) => ({ ...prev, password: true }));
    setErrors((prev) => ({
      ...prev,
      password: validatePassword(value),
      confirmPassword:
        value !== confirmPassword ? "Las contraseñas no coinciden" : "",
    }));
  };

  const handleConfirmPasswordChange = (value) => {
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
      if (otp.length !== 6) {
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
        addToast({
          title: "Éxito",
          description: "Tu contraseña ha sido restablecida exitosamente",
          color: "success",
        });
        setTimeout(() => {
          Navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      addToast({
        title: "Error",
        description: "Ocurrió un error",
        color: "danger",
      });
    }
  };

  const renderFormContent = () => {
    if (!render) {
      return (
        <div className="w-full max-w-[400px] relative flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-[#0B1C33] text-3xl font-extrabold mb-1 drop-shadow-sm">Nueva Contraseña</h2>
            <h3 className="text-[#4A5568] text-lg font-medium drop-shadow-sm">Ingresa tu nueva contraseña segura</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <Input
              label="Nueva contraseña"
              labelPlacement="outside"
              placeholder="Ingresa tu nueva contraseña"
              variant="faded"
              radius="sm"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleVisibility}>
                  {isVisible ? (
                    <EyeOff className="text-xl text-gray-600" />
                  ) : (
                    <Eye className="text-xl text-gray-600" />
                  )}
                </button>
              }
              type={isVisible ? "text" : "password"}
              value={password}
              onValueChange={handlePasswordChange}
              isInvalid={touched.password && !!errors.password}
              errorMessage={touched.password && errors.password}
              classNames={{
                inputWrapper: "bg-white/50 border-white/50 hover:bg-white/70 focus:bg-white transition-colors",
                label: "font-semibold text-gray-700 pb-2",
                input: "text-gray-800"
              }}
            />

            <Input
              label="Confirmar contraseña"
              labelPlacement="outside"
              placeholder="Confirma tu nueva contraseña"
              variant="faded"
              radius="sm"
              endContent={
                <button className="focus:outline-none" type="button" onClick={toggleConfirmVisibility}>
                  {isConfirmVisible ? (
                    <EyeOff className="text-xl text-gray-600" />
                  ) : (
                    <Eye className="text-xl text-gray-600" />
                  )}
                </button>
              }
              type={isConfirmVisible ? "text" : "password"}
              value={confirmPassword}
              onValueChange={handleConfirmPasswordChange}
              isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              errorMessage={touched.confirmPassword && errors.confirmPassword}
              classNames={{
                inputWrapper: "bg-white/50 border-white/50 hover:bg-white/70 focus:bg-white transition-colors",
                label: "font-semibold text-gray-700 pb-2",
                input: "text-gray-800"
              }}
            />

            <Button
              type="submit"
              className="w-full bg-[#1C1D1F] hover:bg-[#2D2E30] text-white font-bold mt-2 shadow-lg"
              size="lg"
              radius="full"
              isLoading={loading}
              isDisabled={
                loading ||
                (touched.password && !!errors.password) ||
                (touched.confirmPassword && !!errors.confirmPassword)
              }
            >
              Restablecer Contraseña
            </Button>
          </form>
          <div className="flex justify-center mt-4 text-[#4A5568] font-medium text-sm gap-2">
            <Link
              className="text-[#2f73f1] hover:text-[#1a5cbd] transition-colors font-semibold"
              to="/login"
            >
              Volver a Iniciar sesión
            </Link>
          </div>
        </div>
      );
    } else {
      return (
        <div className="w-full max-w-[400px] relative flex flex-col justify-center">
          <div className="mb-8">
            <h2 className="text-[#0B1C33] text-3xl font-extrabold mb-1 drop-shadow-sm">Verificación</h2>
            <h3 className="text-[#4A5568] text-lg font-medium drop-shadow-sm">
              Ingresa el código de 6 dígitos que enviamos a tu correo
            </h3>
          </div>

          <form onSubmit={submitOtp} className="flex flex-col gap-6">
            <Input
              type="text"
              label="Código de Verificación"
              labelPlacement="outside"
              placeholder="000000"
              variant="faded"
              radius="sm"
              value={otp}
              onValueChange={(val) => {
                setOtp(val);
                setTouched((prev) => ({ ...prev, otp: true }));
              }}
              isInvalid={touched.otp && !!errors.otp}
              errorMessage={touched.otp && errors.otp}
              maxLength={6}
              classNames={{
                inputWrapper: "bg-white/50 border-white/50 hover:bg-white/70 focus:bg-white transition-colors",
                label: "font-semibold text-gray-700 pb-2",
                input: "text-center text-3xl tracking-[0.5em] font-bold text-gray-800 placeholder:tracking-normal placeholder:text-base",
                innerWrapper: "justify-center"
              }}
            />

            <Button
              type="submit"
              className="w-full bg-[#1C1D1F] hover:bg-[#2D2E30] text-white font-bold mt-2 shadow-lg"
              size="lg"
              radius="full"
              isLoading={loading}
              isDisabled={loading || otp.length !== 6}
            >
              Verificar Código
            </Button>
          </form>
          <div className="flex justify-center mt-4 text-[#4A5568] font-medium text-sm gap-2">
            <Link
              className="text-[#2f73f1] hover:text-[#1a5cbd] transition-colors font-semibold"
              to="/login"
            >
              Volver a Iniciar sesión
            </Link>
          </div>
        </div>
      );
    }
  };

  return (
    <>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-[#E5F1FD] via-[#f0f9ff] to-[#E5F1FD] overflow-hidden relative">

        {/* Background Decorative Blobs */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-400 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 z-0"
        />
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            x: [0, 50, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] bg-purple-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-30 z-0"
        />

        {/* Left Side - Promotional Content */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="hidden lg:flex w-[65%] flex-col justify-center px-16 relative z-10"
        >
          <div className="max-w-2xl">
            <h1 className="text-[#0B1C33] text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
              Tu negocio de streaming <br /> en un solo lugar.
            </h1>
            <p className="text-[#4A5568] text-2xl mb-12 font-medium">
              Gestiona tus cuentas y clientes de forma fácil y rápida.
            </p>

            {/* Infinite Carousel */}
            <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
              <motion.div
                className="flex gap-8 w-max"
                animate={{
                  x: [0, -1036],
                }}
                transition={{
                  duration: 25,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* First Set of Logos */}
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="flex gap-8">
                    <div className="w-20 h-20 bg-black/80 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shrink-0">
                      <img src={netflix} alt="Netflix" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-20 h-20 bg-[#0063e5]/80 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shrink-0">
                      <span className="text-white font-bold text-sm">Disney+</span>
                    </div>
                    <div className="w-20 h-20 bg-[#00A8E1]/80 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shrink-0">
                      <img src={prime} alt="Prime Video" className="w-full h-full object-contain p-2" />
                    </div>
                    <div className="w-20 h-20 bg-[#38003c]/80 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shrink-0">
                      <img src={hbo} alt="HBO Max" className="w-full h-full object-cover" />
                    </div>
                    <div className="w-20 h-20 bg-[#2f2f2f]/80 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shrink-0">
                      <img src={appletv} alt="Apple TV+" className="w-full h-full object-contain p-3" />
                    </div>
                    <div className="w-20 h-20 bg-[#1ce783]/80 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shrink-0">
                      <span className="text-black font-bold text-sm">Hulu</span>
                    </div>
                    <div className="w-20 h-20 bg-[#E50914]/10 backdrop-blur-md rounded-2xl flex items-center justify-center overflow-hidden border border-white/20 shadow-lg shrink-0">
                      <span className="text-red-600 font-bold text-xs">YT Premium</span>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Form Content */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[35%] flex items-center justify-center p-6 lg:p-12 h-screen overflow-y-auto relative z-20"
        >
          {renderFormContent()}
        </motion.div>
      </div>
    </>
  );
}

export default ResetPassword;
