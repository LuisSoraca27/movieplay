import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComboByIdThunk } from "../../../features/user/comboSlice";
import { Button, Chip, Spinner } from "@heroui/react";
import RegisterOrderByCombo from "../../Order/RegisterOrderByCombo";
import ModalCombo from "./ModalCombo";
import { useAuthContext } from "../../../context/AuthContext";
import { ShoppingCart, ArrowLeft } from "lucide-react";

function ComboDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const combo = useSelector((state) => state.combos[0]);

  const [showRegisterOrder, setShowRegisterOrder] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { userAuth } = useAuthContext();

  const isUserAdmin = userAuth?.role === "admin" || userAuth?.role === "superadmin";

  useEffect(() => {
    if (id) {
      dispatch(fetchComboByIdThunk(id));
    }
  }, [id, dispatch]);

  const handleBuyClick = () => {
    if (isUserAdmin) {
      setShowRegisterOrder(true);
    } else {
      setShowModal(true);
    }
  };

  const handleGoBack = () => {
    navigate('/combos');
  };

  if (!combo) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
        <div className="flex flex-col items-center gap-4">
          <Spinner size="lg" color="primary" />
          <p className="text-gray-500 dark:text-gray-400">Cargando combo...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 py-8">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          {/* Botón volver */}
          <button
            onClick={handleGoBack}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-8 transition-colors"
          >
            <ArrowLeft size={20} />
            <span className="font-medium">Volver</span>
          </button>

          {/* Contenedor principal */}
          <div className="bg-white dark:bg-zinc-900 rounded-3xl shadow-xl overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Sección de imagen */}
              <div className="bg-gray-50 dark:bg-zinc-800 p-12 flex items-center justify-center">
                <img
                  src={combo.imgCombos[0]?.urlImagen || "/placeholder.jpg"}
                  alt={combo.name}
                  className="w-full max-w-md h-auto object-contain"
                />
              </div>

              {/* Sección de información */}
              <div className="p-10 lg:p-12 flex flex-col gap-6">
                {/* Título y badge */}
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-4">
                    <h1 className="text-3xl lg:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight">
                      {combo.name}
                    </h1>
                    <Chip
                      size="md"
                      variant="flat"
                      className={`${combo.hasMatchingProfiles
                        ? "bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300"
                        : "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                        }`}
                    >
                      {combo.hasMatchingProfiles ? "Disponible" : "No disponible"}
                    </Chip>
                  </div>
                </div>

                {/* Descripción */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
                    Descripción
                  </h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                    {combo.description || "Descripción no disponible"}
                  </p>
                </div>

                {/* Precio */}
                <div className="mt-4 p-6 bg-gray-50 dark:bg-zinc-800 rounded-2xl">
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Precio</p>
                  <div className="flex items-baseline gap-4">
                    {combo.offerPrice && combo.offerPrice !== 0 && (
                      <span className="text-xl text-gray-400 line-through">
                        ${new Intl.NumberFormat("es-CO").format(combo.offerPrice)}
                      </span>
                    )}
                    <span className="text-4xl lg:text-5xl font-extrabold text-gray-900 dark:text-white">
                      ${new Intl.NumberFormat("es-CO").format(combo.price)}
                    </span>
                  </div>
                </div>

                {/* Botón de compra */}
                <div className="mt-6">
                  <Button
                    size="lg"
                    color="primary"
                    className="w-full font-bold text-lg py-7 shadow-xl shadow-blue-500/25"
                    startContent={<ShoppingCart size={22} />}
                    isDisabled={!combo.hasMatchingProfiles}
                    onPress={handleBuyClick}
                  >
                    {combo.hasMatchingProfiles ? "Comprar ahora" : "No disponible"}
                  </Button>
                </div>

                {/* Nota informativa */}
                <p className="text-xs text-gray-400 dark:text-gray-500 text-center mt-4">
                  Al comprar aceptas nuestros términos de uso. No se aceptan devoluciones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isUserAdmin && (
        <RegisterOrderByCombo
          product={combo}
          show={showRegisterOrder}
          onClose={() => setShowRegisterOrder(false)}
        />
      )}

      {!isUserAdmin && (
        <ModalCombo
          combo={combo}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

export default ComboDetail;
