import { ShieldOff, LogOut, MessageCircle } from "lucide-react";
import { Button } from "@heroui/react";
import { useAuthContext } from "../context/AuthContext";
import { motion } from "framer-motion";

const SubscriptionBlocked = () => {
  const { logout } = useAuthContext();

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50/30 to-slate-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-xl border border-slate-200 p-10 text-center"
      >
        <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldOff size={40} className="text-red-500" />
        </div>

        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Suscripción Vencida
        </h1>

        <p className="text-slate-500 text-sm mb-8 leading-relaxed">
          Tu suscripción ha expirado y el acceso al panel ha sido restringido.
          Contacta al administrador para renovar tu plan y continuar operando.
        </p>

        <div className="space-y-3">
          <a
            href="https://wa.me/"
            target="_blank"
            rel="noopener noreferrer"
            className="block"
          >
            <Button
              className="w-full bg-green-500 text-white font-bold"
              size="lg"
              startContent={<MessageCircle size={18} />}
            >
              Contactar por WhatsApp
            </Button>
          </a>

          <Button
            className="w-full font-bold"
            variant="flat"
            color="danger"
            size="lg"
            startContent={<LogOut size={18} />}
            onPress={handleLogout}
          >
            Cerrar Sesión
          </Button>
        </div>
      </motion.div>
    </div>
  );
};

export default SubscriptionBlocked;
