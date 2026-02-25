import { useState } from "react";
import { useForm } from "react-hook-form";
import { Button, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Input } from "@heroui/react";
import { createCustomer } from "../../features/customer/customerSlice";
import { useDispatch } from "react-redux";
import { Check, Mail, Phone, User } from "lucide-react";

// eslint-disable-next-line react/prop-types
function CreateCustomer({ show, onHide }) {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
    },
  });

  const [loading, setLoading] = useState(false);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const onSubmit = (data) => {
    if (!validateEmail(data.email)) {
      // You might want to handle this validation via react-hook-form 'validate' instead
      return;
    }

    setLoading(true);
    dispatch(createCustomer(data)).then(() => {
      setValue("fullName", "");
      setValue("email", "");
      setValue("phone", "");
      onHide();
      setLoading(false);
    });
  };

  const inputClasses = {
    label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
    inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
    input: "text-slate-800 font-semibold",
  };

  return (
    <Modal
      isOpen={show}
      onClose={onHide}
      backdrop="blur"
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: "rounded-[2rem] border border-slate-100 shadow-2xl safe-area-y",
        header: "border-b border-slate-100 py-4",
        footer: "border-t border-slate-100 py-4",
        closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
      }}
    >
      <ModalContent className="bg-white">
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Cliente</h2>
          <span className="text-sm font-medium text-slate-500">Ingresa los datos del nuevo cliente</span>
        </ModalHeader>
        <ModalBody className="py-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <Input
              label="NOMBRE DEL CLIENTE"
              labelPlacement="outside"
              placeholder="Ej: Juan Perez"
              variant="bordered"
              startContent={<User size={18} className="text-slate-400" />}
              isInvalid={!!errors.fullName}
              errorMessage={errors.fullName?.message}
              classNames={inputClasses}
              {...register("fullName", {
                required: "Este campo es obligatorio",
              })}
            />

            <Input
              label="CORREO ELECTRÓNICO"
              labelPlacement="outside"
              placeholder="correo@ejemplo.com"
              variant="bordered"
              startContent={<Mail size={18} className="text-slate-400" />}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              classNames={inputClasses}
              {...register("email", {
                required: "Este campo es obligatorio",
                validate: (value) => validateEmail(value) || "Email inválido",
              })}
            />

            <Input
              label="NÚMERO DE TELÉFONO"
              labelPlacement="outside"
              placeholder="+57 300 123 4567"
              variant="bordered"
              startContent={<Phone size={18} className="text-slate-400" />}
              isInvalid={!!errors.phone}
              errorMessage={errors.phone?.message}
              classNames={inputClasses}
              {...register("phone", {
                required: "Este campo es obligatorio",
              })}
            />
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="bordered"
            onPress={onHide}
            className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
          >
            Cancelar
          </Button>
          <Button
            className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800"
            onPress={handleSubmit(onSubmit)}
            isLoading={loading}
            startContent={!loading && <Check size={16} />}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default CreateCustomer;
