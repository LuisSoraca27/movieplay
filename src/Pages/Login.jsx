import { useEffect, useState } from "react";
// import "../style/login.css"; 
import logo from "../assets/logo.png";
import fondoWrapper from "../assets/fondo.jpg"; // Keeping if needed, but design looks like solid color/gradient
import { useSelector } from "react-redux";
import { useAuthContext } from "../context/AuthContext";
import useErrorHandler from "../Helpers/useErrorHandler";
import { Input, Button, Link as HeroLink } from "@heroui/react";
import { Link } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";

// Importing Logos
import netflix from "../assets/platforms/netflix-icon.svg";
import prime from "../assets/platforms/prime-video-icon.png";
import max from "../assets/platforms/max_88.png";
import hulu from "../assets/platforms/hulu-icon.svg";
import apple from "../assets/platforms/AppleTVLogo.svg.png";
import spotify from "../assets/platforms/spotify-square-color-icon.svg";

// Get cached publicSettings for logo before auth
const getCachedSettings = () => {
  try {
    const cached = localStorage.getItem('publicSettings');
    return cached ? JSON.parse(cached) : null;
  } catch { return null; }
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const { error, success } = useSelector((state) => state.error);

  const handleErrors = useErrorHandler(error, success);
  const handleEmailChange = (e) => setEmail(e.target.value);
  const handlePasswordChange = (e) => setPassword(e.target.value);
  const { login } = useAuthContext();

  const cachedSettings = getCachedSettings();
  const storeLogo = cachedSettings?.logo || logo;
  const storeName = cachedSettings?.storeName || 'Streaming Solution';

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    login({ email, password });
  };

  useEffect(() => {
    handleErrors();
  }, [error, success]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

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
                className="flex w-max"
                animate={{
                  x: "-50%",
                }}
                transition={{
                  duration: 40,
                  repeat: Infinity,
                  ease: "linear",
                }}
              >
                {/* First Set of Logos */}
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-8 items-center mr-8">
                    {/* Netflix */}
                    <div className="w-20 h-20 shrink-0">
                      <img src={netflix} alt="Netflix" className="w-full h-full object-contain filter drop-shadow-lg" />
                    </div>

                    {/* Prime Video */}
                    <div className="w-25 h-25 shrink-0">
                      <img src={prime} alt="Prime Video" className="w-full h-full object-contain filter drop-shadow-lg scale-110" />
                    </div>

                    {/* Max */}
                    <div className="w-21 h-21 shrink-0">
                      <img src={max} alt="Max" className="w-full h-full object-contain filter drop-shadow-lg" />
                    </div>

                    {/* Hulu */}
                    <div className="w-20 h-20 shrink-0">
                      <img src={hulu} alt="Hulu" className="w-full h-full object-contain filter drop-shadow-lg" />
                    </div>

                    {/* Apple TV+ */}
                    <div className="w-20 h-20 shrink-0">
                      <img src={apple} alt="Apple TV+" className="w-full h-full object-contain filter drop-shadow-lg" />
                    </div>

                    {/* Spotify */}
                    <div className="w-20 h-20 shrink-0">
                      <img src={spotify} alt="Spotify" className="w-full h-full object-contain filter drop-shadow-lg" />
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Right Side - Login Form - Glassmorphism */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-[35%] flex items-center justify-center p-6 lg:p-12 h-screen overflow-y-auto relative z-20"
        >
          <div className="w-full max-w-[400px] relative flex flex-col justify-center">

            <div className="mb-8">
              <img src={storeLogo} alt={`${storeName} Logo`} className="w-32 h-auto mb-4 object-contain" />
              <h3 className="text-[#0B1C33] text-2xl font-bold drop-shadow-sm">Bienvenido a {storeName}</h3>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <Input
                type="email"
                label="Correo electrónico"
                labelPlacement="outside"
                placeholder="Correo electrónico"
                value={email}
                onChange={handleEmailChange}
                isRequired
                variant="faded"
                radius="sm"
                classNames={{
                  inputWrapper: "bg-white/50 border-white/50 hover:bg-white/70 focus:bg-white transition-colors",
                  label: "font-semibold text-gray-700 pb-2",
                  input: "text-gray-800"
                }}
              />
              <Input
                type={isPasswordVisible ? "text" : "password"}
                label="Contraseña"
                labelPlacement="outside"
                placeholder="Contraseña"
                value={password}
                onChange={handlePasswordChange}
                isRequired
                variant="faded"
                radius="sm"
                classNames={{
                  inputWrapper: "bg-white/50 border-white/50 hover:bg-white/70 focus:bg-white transition-colors",
                  label: "font-semibold text-gray-700 pb-2",
                  input: "text-gray-800"
                }}
                endContent={
                  <button
                    className="focus:outline-none"
                    type="button"
                    onClick={togglePasswordVisibility}
                  >
                    {isPasswordVisible ? (
                      <EyeOff className="text-xl text-gray-600" />
                    ) : (
                      <Eye className="text-xl text-gray-600" />
                    )}
                  </button>
                }
              />

              <Button
                type="submit"
                className="w-full bg-[#1C1D1F] hover:bg-[#2D2E30] text-white font-bold mt-2 shadow-lg"
                size="lg"
                radius="full"
                isLoading={loading}
                isDisabled={loading}
              >
                Ingresar
              </Button>

              <div className="flex justify-between mt-4 text-[#4A5568] font-medium text-sm">
                <Link to="/register-sellers" className="hover:text-[#2f73f1] transition-colors">
                  Regístrate
                </Link>
                <Link to="/forgot-password" className="hover:text-[#2f73f1] transition-colors">
                  Restablecer
                </Link>
              </div>

              {/* Legal Links */}
              {(cachedSettings?.termsAndConditions || cachedSettings?.privacyPolicy) && (
                <div className="flex justify-center gap-4 mt-3 text-[#93A3B8] text-xs">
                  {cachedSettings?.termsAndConditions && (
                    <Link to="/terminos" className="hover:text-[#2f73f1] transition-colors">
                      Términos y Condiciones
                    </Link>
                  )}
                  {cachedSettings?.privacyPolicy && (
                    <Link to="/privacidad" className="hover:text-[#2f73f1] transition-colors">
                      Política de Privacidad
                    </Link>
                  )}
                </div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default Login;

