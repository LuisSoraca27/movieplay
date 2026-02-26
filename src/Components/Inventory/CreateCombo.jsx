import { useRef, useState, useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem, Divider } from "@heroui/react";
import { createComboThunk } from "../../features/user/comboSlice";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/toast";
import { Upload, X, Check, Image } from "lucide-react";

const CreateCombo = ({ show, onClose, reCharge }) => {
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);
  const { categories } = useSelector((state) => state.categoriesCP);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    reset,
    setValue
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      offerPrice: "",
      idsCategoryProfile: [],
      idsCategoryAccount: [],
    }
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (error) addToast({ title: 'Error', description: error, color: 'danger' });
    if (success) addToast({ title: 'Éxito', description: success, color: 'success' });
  }, [error, success]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 1000000) {
        addToast({ title: 'Error', description: "El archivo es demasiado grande (Máx 1MB)", color: 'danger' });
        return;
      }
      setFileName(file.name);
      setValue("comboImg", file);
    }
  };

  const onSubmit = (data) => {
    setLoading(true);

    const idsProfile = Array.from(data.idsCategoryProfile || []);
    const idsAccount = Array.from(data.idsCategoryAccount || []);

    const form = new FormData();
    form.append("name", data.name);
    form.append("description", data.description);
    form.append("price", data.price);
    form.append("offerPrice", data.offerPrice || 0);
    if (data.comboImg) form.append("comboImg", data.comboImg);
    form.append("idsCategoryProfile", JSON.stringify(idsProfile));
    form.append("idsCategoryAccount", JSON.stringify(idsAccount));

    dispatch(createComboThunk(form)).finally(() => {
      setLoading(false);
      onClose();
      reset();
      setFileName("");
      reCharge();
    });
  };

  const optionsCategory = useMemo(() => {
    if (!categories || categories.length === 0) return [];
    return categories.map(cat => ({
      name: cat.displayName || cat.name,
      code: String(cat.id)
    }));
  }, [categories]);

  useEffect(() => {
    if (show && (!categories || categories.length === 0)) {
      dispatch(fetchCategories());
    }
  }, [show, dispatch, categories?.length]);

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
          <h2 className="text-xl font-bold text-slate-800">Crear Combo</h2>
          <span className="text-sm font-medium text-slate-500">
            Configure un nuevo combo de productos
          </span>
        </ModalHeader>
        <ModalBody className="py-6">
          <form id="create-combo-form" onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Información básica */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Información del Combo
              </h3>

              <Input
                label="NOMBRE"
                variant="bordered"
                labelPlacement="outside"
                placeholder="Nombre del combo"
                isInvalid={!!errors.name}
                errorMessage={errors.name?.message}
                classNames={inputClasses}
                {...register("name", { required: "El nombre es requerido" })}
              />

              <Textarea
                label="DESCRIPCIÓN"
                variant="bordered"
                labelPlacement="outside"
                minRows={2}
                maxRows={3}
                placeholder="Descripción del combo"
                isInvalid={!!errors.description}
                errorMessage={errors.description?.message}
                classNames={inputClasses}
                {...register("description", { required: "La descripción es requerida" })}
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
                  label="PRECIO TACHADO (OPCIONAL)"
                  variant="bordered"
                  labelPlacement="outside"
                  placeholder="0.00"
                  startContent={
                    <span className="text-slate-400 text-sm font-bold">$</span>
                  }
                  classNames={{
                    ...inputClasses,
                    input: "text-slate-800 font-bold"
                  }}
                  {...register("offerPrice")}
                />
              </div>
            </div>

            <Divider className="my-4" />

            {/* Productos incluidos */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Productos Incluidos
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Controller
                  name="idsCategoryProfile"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="PERFILES DEL COMBO"
                      variant="bordered"
                      labelPlacement="outside"
                      selectionMode="multiple"
                      placeholder="Seleccionar plataformas"
                      selectedKeys={field.value}
                      onSelectionChange={field.onChange}
                      classNames={{
                        ...inputClasses,
                        trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white min-h-12"
                      }}
                    >
                      {optionsCategory.map((opt) => (
                        <SelectItem key={opt.code} value={opt.code}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />

                <Controller
                  name="idsCategoryAccount"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="CUENTAS DEL COMBO"
                      variant="bordered"
                      labelPlacement="outside"
                      selectionMode="multiple"
                      placeholder="Seleccionar plataformas"
                      selectedKeys={field.value}
                      onSelectionChange={field.onChange}
                      classNames={{
                        ...inputClasses,
                        trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white min-h-12"
                      }}
                    >
                      {optionsCategory.map((opt) => (
                        <SelectItem key={opt.code} value={opt.code}>
                          {opt.name}
                        </SelectItem>
                      ))}
                    </Select>
                  )}
                />
              </div>
            </div>

            <Divider className="my-4" />

            {/* Imagen */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                Imagen del Combo
              </h3>

              <div className="flex items-center gap-3">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  variant="bordered"
                  className="border-slate-200 font-semibold text-slate-700"
                  startContent={<Upload size={18} />}
                  onPress={() => fileInputRef.current.click()}
                >
                  Seleccionar imagen
                </Button>
                {fileName && (
                  <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    <Image size={16} className="text-slate-500" />
                    <span className="text-sm text-slate-600 truncate max-w-[180px] font-medium">{fileName}</span>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="light"
                      color="danger"
                      className="min-w-6 w-6 h-6"
                      onPress={() => {
                        setFileName("");
                        setValue("comboImg", "");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                    >
                      <X size={14} />
                    </Button>
                  </div>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">Tamaño máximo: 1MB</p>
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
            form="create-combo-form"
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

export default CreateCombo;
