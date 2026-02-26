import { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Checkbox,
  Image,
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { buyProductThunk } from "../features/user/comboSlice";
import { addToast } from "@heroui/toast";
import { removeError, removeSuccess } from "../features/error/errorSlice";
import { Mail, Tag, ShoppingCart, AlertCircle } from "lucide-react";
import { AddToCartButton } from "../Components/Cart";

const ModalProduct = ({ data, onClose, reCharge }) => {
  const { product, open, type } = data;

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [checked, setChecked] = useState(true);

  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);

  const handleBuy = () => {
    setPurchase(true);
    dispatch(buyProductThunk(product.id, type, email, subject)).finally(() => {
      setPurchase(false);
      onClose();
      reCharge();
    });
  };

  const handleErrors = () => {
    const isSaldoInsuficiente = error && typeof error === 'string' && error.toLowerCase().includes('saldo') && error.toLowerCase().includes('insuficiente');
    if (isSaldoInsuficiente) {
      addToast({
        title: "Saldo insuficiente",
        description: error,
        color: "danger",
      });
      dispatch(removeError());
    } else if (error === "El usuario no tiene suficiente saldo") {
      addToast({
        title: "Saldo insuficiente",
        description: "No tienes suficiente saldo para adquirir este producto",
        color: "danger",
      });
      dispatch(removeError());
    } else if (!!error) {
      addToast({
        title: "Error",
        description: error || "Ha ocurrido un error, por favor intenta de nuevo",
        color: "danger",
      });
      dispatch(removeError());
    } else if (success) {
      addToast({
        title: "¡Éxito!",
        description: "Producto adquirido con éxito. Los datos se han enviado a tu correo.",
        color: "success",
      });
      dispatch(removeSuccess());
    }
  };

  useEffect(() => {
    handleErrors();
  }, [error, success]);

  // Determine image URL safely
  const imageUrl = product.imgCombos
    ? product.imgCombos[0]?.urlImagen
    : product.imgCourses
      ? product.imgCourses[0]?.urlImagen
      : product.imgLicenses
        ? product.imgLicenses[0]?.urlImagen
        : "";

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      backdrop="blur"
      size="3xl"
      scrollBehavior="inside"
      classNames={{
        base: "modal-mobile-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-slate-800 shadow-2xl rounded-[2.5rem]",
        header: "border-b border-slate-100 dark:border-slate-800 px-5 py-4 md:p-8 md:pb-4",
        body: "px-5 py-4 md:p-8",
        footer: "border-t border-slate-100 dark:border-slate-800 px-5 py-4 md:p-8 md:pt-4",
        closeButton: "top-4 right-4 md:top-6 md:right-6 hover:bg-slate-100 dark:hover:bg-slate-800 active:scale-95 transition-transform",
      }}
      motionProps={{
        variants: {
          enter: {
            y: 0, opacity: 1, scale: 1,
            transition: { duration: 0.3, ease: "easeOut" },
          },
          exit: {
            y: -20, opacity: 0, scale: 0.95,
            transition: { duration: 0.2, ease: "easeIn" },
          },
        },
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                Detalles del Producto
              </h2>
            </ModalHeader>

            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                {/* Left Column: Image/Visual — compact on mobile */}
                <div className="flex flex-col items-center justify-center min-h-[120px] md:min-h-[250px] bg-slate-50/50 dark:bg-slate-800/20 rounded-2xl p-3 md:p-6 border border-slate-100 dark:border-slate-800 overflow-hidden">
                  {imageUrl ? (
                    <div className="w-full h-full flex items-center justify-center">
                      <Image
                        src={imageUrl}
                        alt={product?.name}
                        className="w-full h-auto max-h-[180px] md:max-h-[380px] object-contain transition-transform duration-500 hover:scale-105"
                        removeWrapper
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400 font-medium">
                      <AlertCircle size={40} />
                      <span>Sin imagen disponible</span>
                    </div>
                  )}
                </div>

                {/* Right Column: Information */}
                <div className="flex flex-col gap-4 md:gap-6">
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white leading-tight mb-3">
                      {product?.name || 'Producto'}
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      <div className="px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 text-blue-600 dark:text-blue-400 text-[10px] font-bold tracking-wider uppercase">
                        {type === 'combo' ? 'COMBO ESPECIAL' : 'LICENCIA DIGITAL'}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">Descripción</h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {product?.description || "Este producto no tiene una descripción detallada en este momento."}
                    </p>
                  </div>

                  <div className="bg-slate-50 dark:bg-slate-800/30 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                    <Checkbox
                      isSelected={checked}
                      onValueChange={setChecked}
                      size="sm"
                      color="primary"
                    >
                      <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Enviar copia por correo</span>
                    </Checkbox>

                    {checked && (
                      <div className="flex flex-col gap-3 pt-1 animate-appearance-in">
                        <Input
                          startContent={<Tag className="text-slate-400" size={16} />}
                          type="text"
                          label="ASUNTO"
                          labelPlacement="outside"
                          placeholder="Opcional"
                          variant="flat"
                          size="sm"
                          value={subject}
                          onValueChange={setSubject}
                          classNames={{
                            label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                            input: "text-slate-900 dark:text-white font-bold text-sm",
                            inputWrapper: "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                          }}
                        />
                        <Input
                          startContent={<Mail className="text-slate-400" size={16} />}
                          type="email"
                          label="CORREO ELECTRÓNICO"
                          labelPlacement="outside"
                          placeholder="tu@correo.com"
                          variant="flat"
                          size="sm"
                          value={email}
                          onValueChange={setEmail}
                          classNames={{
                            label: "text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-[10px]",
                            input: "text-slate-900 dark:text-white font-bold text-sm",
                            inputWrapper: "bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl transition-colors"
                          }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-2xl border border-blue-100 dark:border-blue-800/30 flex justify-between items-center">
                      <span className="text-xs font-bold text-blue-400 uppercase tracking-widest">Precio Final</span>
                      <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                        ${product?.price?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </ModalBody>

            <ModalFooter className="flex-col md:flex-row gap-2 md:gap-3">
              <div className="flex flex-col md:flex-row gap-2 w-full md:w-auto order-1 md:order-2">
                <AddToCartButton
                  productType={type}
                  productId={product.id}
                  productName={product?.name}
                />
                <Button
                  onPress={handleBuy}
                  isLoading={purchase}
                  startContent={!purchase && <ShoppingCart size={18} />}
                  className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold uppercase tracking-widest text-[11px] h-12 rounded-2xl shadow-lg shadow-slate-900/20 hover:scale-105 active:scale-95 transition-all px-8 w-full md:w-auto"
                >
                  COMPRAR
                </Button>
              </div>
              <Button
                variant="light"
                onPress={onClose}
                className="font-bold uppercase tracking-widest text-[11px] text-slate-500 dark:text-slate-400 h-12 rounded-2xl px-6 w-full md:w-auto order-2 md:order-1"
                startContent={<i className="pi pi-times" />}
              >
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalProduct;
