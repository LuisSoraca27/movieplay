import { useEffect, useState, useRef, useMemo } from "react";
import { useForm, Controller } from "react-hook-form";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Textarea, Select, SelectItem } from "@heroui/react";
import { updateComboThunk } from "../../features/user/comboSlice";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import { addToast } from "@heroui/toast";
import { Check, Upload, X } from "lucide-react";
import { selectCategoriesCPs } from "../../utils/functions/selectNameCategoryOptions";

const EditCombo = ({ show, onClose, reCharge, combo }) => {
  const [loading, setLoading] = useState(false);
  const { success, error } = useSelector((state) => state.error);
  const { categories } = useSelector((state) => state.categoriesCP);
  const dispatch = useDispatch();

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
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");
  const [previewImage, setPreviewImage] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      price: "",
      offerPrice: "0",
      idsCategoryProfile: [],
      idsCategoryAccount: [],
    }
  });

  useEffect(() => {
    if (combo) {
      const { categoriesAccount, categoriesProfile } = selectCategoriesCPs(combo.categoriesCPs);

      // Extract codes from the category objects
      const profileCodes = categoriesProfile ? categoriesProfile.map(cat => cat.code) : [];
      const accountCodes = categoriesAccount ? categoriesAccount.map(cat => cat.code) : [];

      reset({
        name: combo.name || "",
        description: combo.description || "",
        price: combo.price ? String(combo.price) : "",
        offerPrice: combo.offerPrice ? String(combo.offerPrice) : "0",
        idsCategoryProfile: profileCodes,
        idsCategoryAccount: accountCodes,
      });

      if (combo.imgCombos && combo.imgCombos.length > 0) {
        setPreviewImage(combo.imgCombos[0].urlImagen);
        setFileName("Imagen actual");
      } else {
        setPreviewImage("");
        setFileName("");
      }
    }
  }, [combo, reset]);

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

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data) => {
    setLoading(true);
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("price", data.price);
    formData.append("offerPrice", data.offerPrice);

    if (data.comboImg instanceof File) {
      formData.append("comboImg", data.comboImg);
    }

    const profileCodes = Array.isArray(data.idsCategoryProfile) ? data.idsCategoryProfile : Array.from(data.idsCategoryProfile || []);
    const accountCodes = Array.isArray(data.idsCategoryAccount) ? data.idsCategoryAccount : Array.from(data.idsCategoryAccount || []);

    formData.append("idsCategoryProfile", JSON.stringify(profileCodes));
    formData.append("idsCategoryAccount", JSON.stringify(accountCodes));

    dispatch(updateComboThunk(combo.id, formData)).finally(() => {
      reCharge();
      onClose();
      setLoading(false);
    });
  };

  const inputClasses = {
    label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
    inputWrapper: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white",
    input: "text-slate-800 font-semibold",
  };

  return (
    <Modal open={show} onClose={onClose} size="lg" scrollBehavior="inside"
      isOpen={show}
      classNames={{
        base: "rounded-[2rem] border border-slate-100 shadow-2xl safe-area-y",
        header: "border-b border-slate-100 py-4",
        footer: "border-t border-slate-100 py-4",
        closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
      }}
    >
      <ModalContent className="bg-white">
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-xl font-bold text-slate-800">Editar Combo</h2>
          <span className="text-sm font-medium text-slate-500">Actualiza la información del combo seleccionado</span>
        </ModalHeader>
        <ModalBody className="py-6">
          <form id="edit-combo-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="NOMBRE"
              placeholder="Nombre del combo"
              variant="bordered"
              labelPlacement="outside"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              classNames={inputClasses}
              {...register("name", { required: "El nombre es requerido" })}
            />

            <Textarea
              label="DESCRIPCIÓN"
              placeholder="Descripción del combo"
              variant="bordered"
              labelPlacement="outside"
              minRows={2}
              isInvalid={!!errors.description}
              errorMessage={errors.description?.message}
              classNames={inputClasses}
              {...register("description", { required: "La descripción es requerida" })}
            />

            <div className="flex gap-4">
              <Input
                type="number"
                label="PRECIO"
                placeholder="0.00"
                variant="bordered"
                labelPlacement="outside"
                startContent={<div className="pointer-events-none flex items-center"><span className="text-slate-400 text-small font-bold">$</span></div>}
                isInvalid={!!errors.price}
                errorMessage={errors.price?.message}
                classNames={{
                  ...inputClasses,
                  input: "text-slate-800 font-bold"
                }}
                {...register("price", { required: "El precio es requerido" })}
                className="flex-1"
              />
              <Input
                type="number"
                label="PRECIO INFLADO"
                placeholder="0.00"
                variant="bordered"
                labelPlacement="outside"
                startContent={<div className="pointer-events-none flex items-center"><span className="text-slate-400 text-small font-bold">$</span></div>}
                isInvalid={!!errors.offerPrice}
                errorMessage={errors.offerPrice?.message}
                classNames={{
                  ...inputClasses,
                  input: "text-slate-800 font-bold"
                }}
                {...register("offerPrice")}
                className="flex-1"
              />
            </div>

            <Controller
              name="idsCategoryProfile"
              control={control}
              render={({ field }) => (
                <Select
                  {...field}
                  label="PERFILES DEL COMBO"
                  placeholder="Seleccionar plataformas"
                  selectionMode="multiple"
                  variant="bordered"
                  labelPlacement="outside"
                  selectedKeys={new Set(field.value)}
                  onSelectionChange={field.onChange}
                  classNames={{
                    ...inputClasses,
                    trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white"
                  }}
                >
                  {optionsCategory.map((platform) => (
                    <SelectItem key={platform.code} value={platform.code}>
                      {platform.name}
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
                  {...field}
                  label="CUENTAS DEL COMBO"
                  placeholder="Seleccionar plataformas"
                  selectionMode="multiple"
                  variant="bordered"
                  labelPlacement="outside"
                  selectedKeys={new Set(field.value)}
                  onSelectionChange={field.onChange}
                  classNames={{
                    ...inputClasses,
                    trigger: "border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 bg-white"
                  }}
                >
                  {optionsCategory.map((platform) => (
                    <SelectItem key={platform.code} value={platform.code}>
                      {platform.name}
                    </SelectItem>
                  ))}
                </Select>
              )}
            />

            <div className="flex flex-col gap-2">
              <label className="text-slate-500 font-bold uppercase tracking-wider text-[10px]">IMAGEN DEL COMBO</label>

              {previewImage && (
                <div className="mb-2 w-full flex justify-center bg-slate-50 rounded-lg p-2 border border-slate-100">
                  <img
                    src={previewImage}
                    alt="Vista previa"
                    className="max-h-[200px] object-contain rounded-md"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  accept="image/*"
                />
                <Button
                  variant="bordered"
                  className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
                  startContent={<Upload size={18} />}
                  onPress={() => fileInputRef.current.click()}
                >
                  Seleccionar imagen
                </Button>
                {fileName && <span className="text-sm text-slate-500 truncate max-w-[150px] font-medium">{fileName}</span>}
                {fileName && (
                  <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => {
                    setFileName("");
                    setPreviewImage(combo.imgCombos?.[0]?.urlImagen || "");
                    setValue("comboImg", null);
                    if (fileInputRef.current) fileInputRef.current.value = "";
                  }}>
                    <X size={16} />
                  </Button>
                )}
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
            type="submit"
            form="edit-combo-form"
            isLoading={loading}
            startContent={!loading && <Check size={18} />}
          >
            Actualizar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default EditCombo;
