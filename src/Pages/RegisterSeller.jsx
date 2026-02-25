import React, { useEffect, useState } from "react";
import { createUserSellerThunk } from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { addToast } from "@heroui/toast";
import { Input, Button, Select, SelectItem } from "@heroui/react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "framer-motion";
import getPrefixCountry from "../utils/functions/getPrefixCountry";
import useErrorHandler from "../Helpers/useErrorHandler";

// Importing Logos (Matching Login.jsx)
import netflix from "../assets/img/netflix.png";
import prime from "../assets/img/amazon_prime.png";
import hbo from "../assets/img/hbo_max.png";
import appletv from "../assets/img/apple_tv.png";
import hulu from "../assets/img/paramount-plus.png";

const RegisterSeller = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, success } = useSelector((state) => state.error);
  const handleError = useErrorHandler(error, success);

  const initialData = {
    username: "",
    email: "",
    password: "",
    phone: "",
    role: "seller",
    country: '',
  };

  const [dataUser, setDataUser] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [prefix, setPrefix] = useState("--");

  const countries = [
    { name: "Afganistán", code: "AF" },
    { name: "Alemania", code: "DE" },
    { name: "Arabia Saudita", code: "SA" },
    { name: "Argentina", code: "AR" },
    { name: "Australia", code: "AU" },
    { name: "Bélgica", code: "BE" },
    { name: "Bolivia", code: "BO" },
    { name: "Brasil", code: "BR" },
    { name: "Canadá", code: "CA" },
    { name: "Chile", code: "CL" },
    { name: "China", code: "CN" },
    { name: "Colombia", code: "CO" },
    { name: "Corea del Sur", code: "KR" },
    { name: "Costa Rica", code: "CR" },
    { name: "Cuba", code: "CU" },
    { name: "Dinamarca", code: "DK" },
    { name: "Ecuador", code: "EC" },
    { name: "Egipto", code: "EG" },
    { name: "El Salvador", code: "SV" },
    { name: "España", code: "ES" },
    { name: "Estados Unidos", code: "US" },
    { name: "Francia", code: "FR" },
    { name: "Grecia", code: "GR" },
    { name: "Guatemala", code: "GT" },
    { name: "Honduras", code: "HN" },
    { name: "India", code: "IN" },
    { name: "Indonesia", code: "ID" },
    { name: "Irán", code: "IR" },
    { name: "Irlanda", code: "IE" },
    { name: "Israel", code: "IL" },
    { name: "Italia", code: "IT" },
    { name: "Japón", code: "JP" },
    { name: "México", code: "MX" },
    { name: "Nicaragua", code: "NI" },
    { name: "Noruega", code: "NO" },
    { name: "Panamá", code: "PA" },
    { name: "Paraguay", code: "PY" },
    { name: "Perú", code: "PE" },
    { name: "Portugal", code: "PT" },
    { name: "Reino Unido", code: "GB" },
    { name: "Rusia", code: "RU" },
    { name: "Suecia", code: "SE" },
    { name: "Suiza", code: "CH" },
    { name: "Uruguay", code: "UY" },
    { name: "Venezuela", code: "VE" },
    { name: "Otro", code: "OT" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDataUser(prev => ({ ...prev, [name]: value }));
  };

  const handleCountryChange = (e) => {
    const selectedName = e.target.value;
    setDataUser(prev => ({ ...prev, country: selectedName }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    if (Object.values(dataUser).some(value => value === "")) {
      addToast({
        title: "Error",
        description: "Por favor completa todos los campos",
        color: "danger",
      });
      setLoading(false);
      return;
    }

    dispatch(createUserSellerThunk(dataUser)).then((res) => {
      if (!res.error) {
        setTimeout(() => {
          navigate("/login", { replace: true });
        }, 2500);
      } else {
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    const toastAdapter = {
      show: (options) => {
        const colorMap = {
          error: "danger",
          success: "success",
          info: "primary",
          warn: "warning"
        };
        addToast({
          title: options.summary || "Notificación",
          description: options.detail,
          color: colorMap[options.severity] || "default",
        });
      }
    };
    handleError({ current: toastAdapter });
  }, [error, success]);

  useEffect(() => {
    if (error) {
      setLoading(false);
    }
  }, [error]);

  useEffect(() => {
    const countryObj = countries.find(c => c.name === dataUser.country);
    if (countryObj) {
      setPrefix(getPrefixCountry(countryObj.name));
    }
  }, [dataUser.country]);

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  return (
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
        className="hidden lg:flex w-[60%] flex-col justify-center px-16 relative z-10"
      >
        <div className="max-w-2xl">
          <h1 className="text-[#0B1C33] text-6xl font-bold leading-tight mb-6 drop-shadow-sm">
            Únete a nuestra <br /> red de vendedores.
          </h1>
          <p className="text-[#4A5568] text-2xl mb-12 font-medium">
            Genera ingresos extra vendiendo las mejores plataformas de streaming.
          </p>

          {/* Simple Infinite Carousel */}
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

      {/* Right Side - Registration Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full lg:w-[40%] flex items-center justify-center p-6 lg:p-12 h-screen overflow-y-auto relative z-20"
      >
        <div className="w-full max-w-[500px] relative flex flex-col justify-center my-auto">
          <div className="mb-6 text-center lg:text-left">
            <h2 className="text-[#0B1C33] text-3xl font-extrabold mb-1 drop-shadow-sm">Crear cuenta</h2>
            <h3 className="text-[#4A5568] text-lg font-medium drop-shadow-sm">Completa el formulario para empezar</h3>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              type="text"
              label="Nombre de usuario"
              labelPlacement="outside"
              name="username"
              placeholder="Tu nombre de usuario"
              value={dataUser.username}
              onChange={handleChange}
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
              type="email"
              label="Correo electrónico"
              labelPlacement="outside"
              name="email"
              placeholder="ejemplo@correo.com"
              value={dataUser.email}
              onChange={handleChange}
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
              name="password"
              placeholder="Contraseña segura"
              value={dataUser.password}
              onChange={handleChange}
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

            <Select
              label="País"
              labelPlacement="outside"
              placeholder="Selecciona tu país"
              selectedKeys={dataUser.country ? [dataUser.country] : []}
              onChange={handleCountryChange}
              variant="faded"
              radius="sm"
              classNames={{
                trigger: "bg-white/50 border-white/50 hover:bg-white/70 focus:bg-white transition-colors",
                label: "font-semibold text-gray-700 pb-2",
                value: "text-gray-800"
              }}
            >
              {countries.map((country) => (
                <SelectItem key={country.name} value={country.name} startContent={
                  <img
                    alt={country.name}
                    src={`https://flagcdn.com/w20/${country.code.toLowerCase()}.png`}
                    className="w-5 mr-2"
                  />
                }>
                  {country.name}
                </SelectItem>
              ))}
            </Select>

            <div className="flex gap-2">
              <Input
                type="text"
                label="Prefijo"
                labelPlacement="outside"
                value={prefix}
                isReadOnly
                className="w-24"
                variant="faded"
                radius="sm"
                classNames={{
                  inputWrapper: "bg-white/50 border-white/50",
                  label: "font-semibold text-gray-700 pb-2",
                  input: "text-gray-800"
                }}
              />
              <Input
                type="tel"
                label="Teléfono"
                labelPlacement="outside"
                name="phone"
                placeholder="Número de teléfono"
                value={dataUser.phone}
                onChange={handleChange}
                isRequired
                className="flex-1"
                variant="faded"
                radius="sm"
                classNames={{
                  inputWrapper: "bg-white/50 border-white/50 hover:bg-white/70 focus:bg-white transition-colors",
                  label: "font-semibold text-gray-700 pb-2",
                  input: "text-gray-800"
                }}
              />
            </div>


            <Button
              type="submit"
              className="w-full bg-[#1C1D1F] hover:bg-[#2D2E30] text-white font-bold mt-4 shadow-lg"
              size="lg"
              radius="full"
              isLoading={loading}
              isDisabled={loading}
            >
              Registrarse
            </Button>

            <div className="flex justify-center mt-4 text-[#4A5568] font-medium text-sm gap-2">
              <span>¿Ya tienes cuenta?</span>
              <Link to="/login" className="text-[#2f73f1] hover:text-[#1a5cbd] transition-colors font-semibold">
                Inicia sesión
              </Link>
            </div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default RegisterSeller;
