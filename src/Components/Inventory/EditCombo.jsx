import { useEffect, useState, useRef } from "react";
import { Button } from "primereact/button";
import { updateComboThunk } from "../../features/user/comboSlice";
import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Toast } from "primereact/toast";
import useErrorHandler from "../../Helpers/useErrorHandler";
import { InputNumber } from "primereact/inputnumber";
import { FileUpload } from "primereact/fileupload";
import { MultiSelect } from "primereact/multiselect";
import { selectCategoriesCPs } from "../../utils/functions/selectNameCategoryOptions";

const EditCombo = ({ show, onClose, reCharge, combo }) => {
  
  const opcionesPlataformas = [
    { name: "Amazon Prime Video", code: "1" },
    { name: "Netflix", code: "2" },
    { name: "Max", code: "3" },
    { name: "Disney Premium", code: "4" },
    { name: "Paramount+", code: "6" },
    { name: "Vix+", code: "7" },
    { name: "Plex", code: "8" },
    { name: "Crunchyroll", code: "9" },
    { name: "Profenet", code: "10" },
    { name: "iptv", code: "11" },
    { name: "Universal+", code: "18" },
    { name: "Apple TV", code: "19" },
    { name: "Pornhub", code: "20" },
    { name: "Brazzers", code: "21" },
    { name: "Rakuten Viki", code: "22" },
    { name: "Mubi", code: "24" },
    { name: "Wasender", code: "25" },
    { name: "Mubi", code: "26" },
    { name: "TvMia", code: "28" },
    { name: "Dbasico", code: "29" },
    { name: "Destandar", code: "30" },
    { name: "Microsoft365", code: "31" },
  ];

  const [procesing, setProcesing] = useState(false);
  const { success, error } = useSelector((state) => state.error);

  const dispatch = useDispatch();
  const toast = useRef(null);

  const handleErrors = useErrorHandler(error, success);

  // Cargar los datos del combo en el formulario
  const [formData, setFormData] = useState({
    name: combo?.name || "",
    description: combo?.description || "",
    price: combo?.price || "",
    comboImg: combo?.comboImg || "",
    idsCategory: combo?.categoriesCPs
      ? selectCategoriesCPs(combo.categoriesCPs) // Convertir al formato esperado
      : []
  });

  const [previewImage, setPreviewImage] = useState(formData.comboImg); // Estado para la vista previa de la imagen

  useEffect(() => {
    if (combo) {
      setFormData({
        name: combo.name,
        description: combo.description,
        price: combo.price,
        comboImg: combo.imgCombos?.[0]?.urlImagen || "", // Asignar la URL de la imagen
        idsCategory: selectCategoriesCPs(combo.categoriesCPs || []) // Convertir al formato esperado
      });
      setPreviewImage(combo.imgCombos?.[0]?.urlImagen || ""); // Asignar la imagen para la vista previa
    }
  }, [combo]);
  

  const handleImageSelect = (e) => {
    const file = e.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Mostrar la imagen seleccionada como vista previa
      };
      reader.readAsDataURL(file); // Leer el archivo seleccionado
      setFormData({ ...formData, comboImg: file }); // Guardar el archivo en formData
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcesing(true);
    // Eliminar duplicados en idsCategory
    const idsCategory = [...new Set(formData.idsCategory.map((id) => id.code))];

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    if (formData.comboImg instanceof File) {
      form.append("comboImg", formData.comboImg);
    }
    form.append("idsCategory", JSON.stringify(idsCategory));

    dispatch(updateComboThunk(combo.id, form)).finally(() => {
      reCharge();
      onClose();
      setProcesing(false);
    });
  };

  useEffect(() => {
    handleErrors(toast.current);
  }, [error, success]);

  return (
    <>
      <Dialog
        visible={show}
        onHide={onClose}
        style={{ width: "390px" }}
        header="Editar Combo"
        footer={
          <div>
            <Button
              label="Confirmar"
              icon="pi pi-check"
              onClick={handleSubmit}
              loading={procesing}
              disabled={procesing}
              autoFocus
              severity="success"
            />
          </div>
        }
      >
        <div style={{ width: "100%", marginBottom: "12px" }}>
          <label htmlFor="Nombre" style={{ fontWeight: "bold" }}>
            Nombre
          </label>
          <InputText
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ width: "100%", marginBottom: "12px" }}>
          <label htmlFor="Descripcion" style={{ fontWeight: "bold" }}>
            Descripción
          </label>
          <InputTextarea
            id="description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            cols={5}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ width: "100%", marginBottom: "12px" }}>
          <label
            htmlFor="Descripcion"
            style={{ fontWeight: "bold", display: "block" }}
          >
            Precio
          </label>
          <InputNumber
            inputId="currency-cop"
            value={formData.price}
            onValueChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
            mode="currency"
            currency="COP"
            locale="es-CO"
            minFractionDigits={0}
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ width: "100%", marginBottom: "12px" }}>
          <label htmlFor="plataformas" style={{ fontWeight: "bold" }}>
            Plataformas
          </label>
          <MultiSelect
            value={formData.idsCategory}
            onChange={(e) => {
              // Evitar duplicados en tiempo real
              const uniqueValues = [...new Set(e.value)];
              setFormData({ ...formData, idsCategory: uniqueValues });
            }}
            options={opcionesPlataformas}
            optionLabel="name"
            placeholder="Seleccionar plataformas"
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ width: "100%", marginBottom: "12px" }}>
          <label htmlFor="plataformas" style={{ fontWeight: "bold" }}>
            Imagen del Combo
          </label>
          {previewImage && (
            <img
              src={previewImage}
              alt="Combo"
              style={{ width: "100%", marginBottom: "12px" }}
            />
          )}
          <FileUpload
            id="comboImg"
            mode="basic"
            onSelect={handleImageSelect} // Manejar la selección de la nueva imagen
            accept="image/*"
            style={{ width: "100%" }}
            chooseLabel="Seleccionar imagen"
          />
        </div>
      </Dialog>
      <Toast ref={toast} />
    </>
  );
};

export default EditCombo;
