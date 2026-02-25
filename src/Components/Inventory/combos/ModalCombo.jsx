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
} from "@heroui/react";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/toast";
import { removeError, removeSuccess } from "../../../features/error/errorSlice";
import { buyComboThunk } from "../../../features/user/comboSlice";
import { Mail, Tag, ShoppingCart, Check, X } from "lucide-react";
import { AddToCartButton } from "../../Cart";

const ModalCombo = ({ combo, onClose, show }) => {

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [purchase, setPurchase] = useState(false);
  const [checked, setChecked] = useState(false);

  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);

  const handleBuy = () => {
    const form = new FormData()
    form.append("combo", JSON.stringify(combo))
    form.append("email", email);
    form.append("subject", subject);
    setPurchase(true);
    dispatch(buyComboThunk(form)).finally(() => {
      setPurchase(false);
      onClose();
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
        description: "No tienes suficiente saldo para adquirir este combo",
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
        description: "El producto se ha adquirido con éxito. Los datos se han enviado a tu correo.",
        color: "success",
      });
      dispatch(removeSuccess());
    }
  };

  useEffect(() => {
    handleErrors();
  }, [error, success]);

  const inputClasses = {
    label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
    inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
    input: "text-slate-800 font-semibold",
  };

  return (
    <Modal
      isOpen={show}
      onClose={onClose}
      backdrop="blur"
      size="5xl"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[2rem] border border-slate-100 shadow-2xl safe-area-y bg-white",
        header: "border-b border-slate-100 py-4 px-6",
        body: "py-6 px-6",
        footer: "border-t border-slate-100 py-4 px-6",
        closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1 py-4">
              <h2 className="text-xl font-bold text-slate-800">
                {combo?.name}
              </h2>
              <p className="text-sm font-medium text-slate-500">
                Revisa los detalles antes de confirmar tu compra
              </p>
            </ModalHeader>
            <ModalBody>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Columna izquierda: Imagen grande */}
                <div className="flex items-center justify-center bg-slate-50 rounded-2xl p-4 border border-slate-100">
                  {combo?.imgCombos?.[0]?.urlImagen ? (
                    <img
                      src={combo.imgCombos[0].urlImagen}
                      alt={combo?.name}
                      className="w-full h-auto max-h-[400px] object-contain drop-shadow-xl"
                    />
                  ) : (
                    <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 gap-2">
                      <Tag size={48} className="opacity-20" />
                      <span className="font-semibold text-sm uppercase tracking-widest">Sin Imagen</span>
                    </div>
                  )}
                </div>

                {/* Columna derecha: Información */}
                <div className="flex flex-col gap-6">
                  {/* Descripción */}
                  {combo?.description && (
                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                        Descripción
                      </h4>
                      <p className="text-sm text-slate-600 font-medium leading-relaxed">
                        {combo.description}
                      </p>
                    </div>
                  )}

                  {/* Precio */}
                  <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-1">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      Precio total
                    </p>
                    <p className="text-4xl font-black text-slate-900 tracking-tight">
                      ${combo?.price?.toLocaleString('es-CO')}
                    </p>
                  </div>

                  {/* Checkbox de envío */}
                  <div className="flex flex-col gap-4">
                    <Checkbox
                      isSelected={checked}
                      onValueChange={setChecked}
                      classNames={{
                        label: "text-sm font-semibold text-slate-700",
                        wrapper: "before:border-slate-300 after:bg-slate-900"
                      }}
                    >
                      Enviar copia por correo electrónico
                    </Checkbox>

                    {checked && (
                      <div className="flex flex-col gap-4 animate-appearance-in p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <Input
                          startContent={<Tag className="text-slate-400" size={16} />}
                          type="text"
                          label="ASUNTO (OPCIONAL)"
                          placeholder="Ingresa un asunto"
                          variant="bordered"
                          labelPlacement="outside"
                          size="sm"
                          value={subject}
                          onValueChange={setSubject}
                          classNames={inputClasses}
                        />
                        <Input
                          startContent={<Mail className="text-slate-400" size={16} />}
                          type="email"
                          label="CORREO ELECTRÓNICO"
                          placeholder="ejemplo@correo.com"
                          variant="bordered"
                          labelPlacement="outside"
                          size="sm"
                          value={email}
                          onValueChange={setEmail}
                          classNames={inputClasses}
                        />
                      </div>
                    )}
                  </div>

                  {/* Términos */}
                  <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-100">
                    <p className="text-[10px] font-bold text-yellow-700 uppercase tracking-widest mb-2">
                      Términos importantes
                    </p>
                    <ul className="list-disc list-inside text-xs text-yellow-800/80 font-medium space-y-1">
                      <li>Al comprar aceptas nuestros Términos de Uso</li>
                      <li>No se aceptan devoluciones ni reembolsos</li>
                    </ul>
                  </div>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="flex justify-between items-center bg-white gap-2">
              <Button
                variant="bordered"
                onPress={onClose}
                className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs h-10 px-6 rounded-xl"
              >
                Cancelar
              </Button>
              <div className="flex gap-2">
                <AddToCartButton
                  productType="combo"
                  productId={combo?.id}
                  productName={combo?.name}
                  size="lg"
                  className="bg-slate-100 text-slate-900 font-bold uppercase tracking-widest text-xs h-10 px-6 rounded-xl hover:bg-slate-200"
                />
                <Button
                  className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800 h-10 px-6 rounded-xl"
                  onPress={handleBuy}
                  isLoading={purchase}
                  startContent={!purchase && <ShoppingCart size={16} />}
                >
                  Comprar Ahora
                </Button>
              </div>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalCombo;
