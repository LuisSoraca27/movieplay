import { Button, Chip, Card, CardBody, CardFooter } from "@heroui/react";
import { useAuthContext } from "../context/AuthContext";
import ModalCombo from "./Inventory/combos/ModalCombo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterOrderByCombo from "./Order/RegisterOrderByCombo";
import { Eye, ShoppingCart } from "lucide-react";
import { AddToCartButton } from "./Cart";

// eslint-disable-next-line react/prop-types
const CardCombo = ({ combo, onClick }) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showRegisterOrder, setShowRegisterOrder] = useState(false);

  const { userAuth } = useAuthContext();
  const isUserAdmin = userAuth?.role === "admin" || userAuth?.role === "superadmin";

  const handleBuyClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isUserAdmin) {
      setShowRegisterOrder(true);
    } else {
      setShowModal(true);
    }
  };

  const handleDetailClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/combos/${combo.id}`, { replace: true });
  };

  return (
    <>
      <Card
        className="group w-full bg-white dark:bg-zinc-900 border border-gray-100 dark:border-zinc-800 shadow-md hover:shadow-2xl transition-all duration-300 ease-in-out hover:-translate-y-2 rounded-2xl overflow-hidden"
        isPressable
        onPress={onClick}
      >
        <CardBody className="p-0 relative">
          {/* Badge de estado */}
          <div className="absolute top-4 right-4 z-10">
            <Chip
              size="sm"
              variant="flat"
              className={`${combo.hasMatchingProfiles
                ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300'
                : 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300'
                }`}
            >
              {combo.hasMatchingProfiles ? 'Disponible' : 'Agotado'}
            </Chip>
          </div>

          {/* Imagen del producto */}
          <div className="w-full aspect-square bg-gray-50 dark:bg-zinc-800 flex items-center justify-center p-8">
            <img
              src={combo?.imgCombos?.[0]?.urlImagen}
              alt={combo.name}
              className="w-full h-full object-contain transition-transform duration-500 ease-out group-hover:scale-110"
            />
          </div>
        </CardBody>

        <CardFooter className="flex flex-col items-start p-6 gap-4 bg-white dark:bg-zinc-900">
          {/* Nombre del producto */}
          <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 leading-tight" title={combo.name}>
            {combo.name}
          </h3>

          {/* Precio */}
          <div className="flex items-baseline gap-3 w-full">
            {combo.offerPrice && combo.offerPrice !== 0 && (
              <span className="text-sm text-gray-400 line-through">
                ${new Intl.NumberFormat("es-CO").format(combo.offerPrice)}
              </span>
            )}
            <span className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
              ${new Intl.NumberFormat("es-CO").format(combo.price)}
            </span>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2 w-full mt-2" onClick={(e) => e.stopPropagation()}>
            <Button
              size="md"
              variant="bordered"
              className="flex-1 font-semibold text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-zinc-600 hover:bg-gray-100 dark:hover:bg-zinc-800"
              startContent={<Eye size={18} />}
              onClick={handleDetailClick}
            >
              Ver detalles
            </Button>
            {!isUserAdmin && combo.hasMatchingProfiles && (
              <AddToCartButton
                productType="combo"
                productId={combo.id}
                productName={combo.name}
                disabled={!combo.hasMatchingProfiles}
                iconOnly
                size="md"
              />
            )}
            <Button
              size="md"
              color="primary"
              className="flex-1 font-bold shadow-lg shadow-blue-500/25"
              startContent={<ShoppingCart size={18} />}
              onClick={handleBuyClick}
              isDisabled={!combo.hasMatchingProfiles}
            >
              Comprar
            </Button>
          </div>
        </CardFooter>
      </Card>

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
};

export default CardCombo;
