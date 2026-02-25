import { Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Home, User } from "lucide-react";

const Success = () => {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full bg-gradient-to-br from-[#E5F1FD] via-[#f0f9ff] to-[#E5F1FD] overflow-hidden relative items-center justify-center p-4">

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

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        className="relative z-10 w-full max-w-[450px] flex flex-col items-center justify-center bg-white/60 backdrop-blur-xl p-8 rounded-3xl border border-white/60 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          className="mb-6 rounded-full bg-green-100 p-4"
        >
          <CheckCircle className="w-20 h-20 text-green-500" strokeWidth={1.5} />
        </motion.div>

        <h1 className="text-[#0B1C33] text-3xl font-extrabold mb-4 drop-shadow-sm">
          ¡Recarga Exitosa!
        </h1>

        <p className="text-[#4A5568] text-lg font-medium mb-2 leading-relaxed">
          Tu recarga se ha procesado correctamente.
        </p>
        <p className="text-[#718096] mb-8">
          El saldo se reflejará en tu cuenta en breve. <br /> Gracias por tu confianza.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Button
            onPress={() => navigate('/profiles')}
            className="w-full bg-[#1C1D1F] text-white font-bold shadow-lg shadow-gray-400/20"
            size="lg"
            radius="full"
            startContent={<Home size={20} />}
          >
            Volver a Perfiles
          </Button>
          <Button
            onPress={() => navigate('/mi-perfil')}
            variant="bordered"
            className="w-full font-bold border-2 border-[#1C1D1F] text-[#1C1D1F]"
            size="lg"
            radius="full"
            startContent={<User size={20} />}
          >
            Ver mi Perfil
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default Success;