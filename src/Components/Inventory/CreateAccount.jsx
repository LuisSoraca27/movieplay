import { useEffect, useState, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Divider } from "@heroui/react";
import { createAccountThunk } from "../../features/account/accountSlice";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/toast";
import { Check, X } from "lucide-react";

const CreateAccount = ({ show, onClose, reCharge }) => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);

  // Obtener categorías desde Redux
  const { categories } = useSelector((state) => state.categoriesCP);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    watch
  } = useForm();

  const [loading, setLoading] = useState(false);

  // Convertir categorías al formato esperado
  const platformOptions = useMemo(() => {
    if (!categories || categories.length === 0) {
      return [];
    }
    return categories.map(cat => ({
      label: cat.displayName || cat.name,
      value: String(cat.id)
    }));
  }, [categories]);

  const categoryId = watch("categoryId");
  const isIPTV = categoryId === "11" || categories?.find(c => String(c.id) === categoryId)?.name === "iptv";

  // Cargar categorías al montar
  useEffect(() => {
    if (show && categories?.length === 0) {
      dispatch(fetchCategories());
    }
  }, [show, dispatch, categories?.length]);

  useEffect(() => {
    if (error) addToast({ title: 'Error', description: error, color: 'danger' });
    if (success) addToast({ title: 'Éxito', description: success, color: 'success' });
  }, [error, success]);

  const onSubmit = (data) => {
    setLoading(true);
    const dataAccount = {
      ...data,
      categoryId: data.categoryId,
    };

    dispatch(createAccountThunk(dataAccount)).then(() => {
      setLoading(false);
      onClose();
      reset();
      reCharge();
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
      onClose={onClose}
      size="2xl"
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
          <h2 className="text-xl font-bold text-slate-800">Crear Cuenta</h2>
          <span className="text-sm font-medium text-slate-500">Complete la información de la nueva cuenta</span>
        </ModalHeader>
        <ModalBody className="py-6">
          <form id="create-account-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información del producto */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Información del Producto
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="categoryId"
                  control={control}
                  rules={{ required: "La plataforma es requerida" }}
                  render={({ field }) => (
                    <Select
                      label="PLATAFORMA"
                      variant="bordered"
                      labelPlacement="outside"
                      selectedKeys={field.value ? [field.value] : []}
                      onChange={(e) => field.onChange(e.target.value)}
                      isInvalid={!!errors.categoryId}
                      errorMessage={errors.categoryId?.message}
                      classNames={{
                        ...inputClasses,
                        trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white"
                      }}
                    >
                      {platformOptions.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />

                <Input
                  label="NOMBRE"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="Nombre de la cuenta"
                  isInvalid={!!errors.name}
                  errorMessage={errors.name?.message}
                  classNames={inputClasses}
                  {...register("name", { required: "El nombre es requerido" })}
                />
              </div>

              <Textarea
                label="DESCRIPCIÓN"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Detalles adicionales..."
                minRows={2}
                maxRows={3}
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                classNames={inputClasses}
                {...register("description", {
                  required: "La descripción es requerida",
                  maxLength: { value: 230, message: "Máximo 230 caracteres" }
                })}
              />

              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  label="PRECIO"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="0.00"
                  startContent={
                    <span className="text-slate-400 text-sm font-bold">$</span>
                  }
                  isInvalid={!!errors.price}
                  errorMessage={errors.price?.message}
                  classNames={{
                    ...inputClasses,
                    input: "text-slate-800 font-bold"
                  }}
                  {...register("price", { required: "El precio es requerido" })}
                />
                <Input
                  type="number"
                  label="DURACIÓN (DÍAS)"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="30"
                  isInvalid={!!errors.durationOfService}
                  errorMessage={errors.durationOfService?.message}
                  classNames={inputClasses}
                  {...register("durationOfService", { required: "La duración es requerida" })}
                />
              </div>
            </div>

            <Divider className="my-4" />

            {/* Credenciales */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                {isIPTV ? "Datos de IPTV" : "Credenciales de Acceso"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label={isIPTV ? "NOMBRE IPTV" : "CORREO"}
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder={isIPTV ? "Nombre del servicio" : "correo@cuenta.com"}
                  isInvalid={!!errors.emailAccount}
                  errorMessage={errors.emailAccount?.message}
                  classNames={inputClasses}
                  {...register("emailAccount", { required: "Este campo es requerido" })}
                />

                <Input
                  type={isIPTV ? "text" : "password"}
                  label={isIPTV ? "USUARIO" : "CONTRASEÑA"}
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="••••••••"
                  isInvalid={!!errors.passwordAccount}
                  errorMessage={errors.passwordAccount?.message}
                  classNames={inputClasses}
                  {...register("passwordAccount", { required: "Este campo es requerido" })}
                />
              </div>
            </div>
          </form>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="bordered"
            onPress={onClose}
            className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
          >
            Cancelar
          </Button>
          <Button
            className="bg-slate-900 text-white font-bold uppercase tracking-widest text-xs shadow-lg hover:bg-slate-800"
            form="create-account-form"
            type="submit"
            isLoading={loading}
            startContent={!loading && <Check size={16} />}
          >
            Confirmar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateAccount;
