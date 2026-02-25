import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import dksoluciones from "../api/config";

// Importing Logos (Matching Login.jsx)
import netflix from "../assets/img/netflix.png";
import prime from "../assets/img/amazon_prime.png";
import hbo from "../assets/img/hbo_max.png";
import appletv from "../assets/img/apple_tv.png";
import hulu from "../assets/img/paramount-plus.png";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      addToast({
        title: "Error",
        description: "El correo electrónico es requerido",
        color: "danger",
      });
      return;
    }

    if (!validateEmail(email)) {
      addToast({
        title: "Error",
        description: "Por favor ingresa un correo electrónico válido",
        color: "danger",
      });
      return;
    }

    setLoading(true);
    try {
      const res = await dksoluciones.post("/user/forgotpassword", { email });
      if (res.status === 200) {
        addToast({
          title: "Éxito",
          description: "Correo enviado con éxito. Revisa tu bandeja de entrada.",
          color: "success",
        });
        setTimeout(() => {
          navigate("/reset-password");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
      addToast({
        title: "Error",
        description: "No se pudo enviar el correo. Verifique si la cuenta existe o intente más tarde.",
        color: "danger",
      });
    } finally {
      setLoading(false);
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

        {/* Right Side - Forgot Password Form - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[35%] flex items-center justify-center p-6 lg:p-12 h-screen overflow-y-auto relative z-20"
        >
          <div className="w-full max-w-[400px] relative flex flex-col justify-center">

            <div className="mb-8">
              <h2 className="text-[#0B1C33] text-3xl font-extrabold mb-1 drop-shadow-sm">Recuperar Contraseña</h2>
              <h3 className="text-[#4A5568] text-lg font-medium drop-shadow-sm">Ingresa tu correo para continuar</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                type="email"
                label="Correo electrónico"
                labelPlacement="outside"
                placeholder="ejemplo@correo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isRequired
                variant="faded"
                radius="sm"
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
                isDisabled={loading}
              >
                Enviar correo
              </Button>

              <div className="flex justify-center mt-4 text-[#4A5568] font-medium text-sm gap-2">
                <span>¿Recordaste tu contraseña?</span>
                <Link to="/login" className="text-[#2f73f1] hover:text-[#1a5cbd] transition-colors font-semibold">
                  Iniciar sesión
                </Link>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
}

export default ForgotPassword;