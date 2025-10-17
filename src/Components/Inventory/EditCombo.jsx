/* eslint-disable react/prop-types */
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
    { name: "Netflix", code: "2" },
    { name: "Max Premium", code: "3" },
    { name: "Max Estándar", code: "17" },
    { name: "Disney+ Premium", code: "4" },
    { name: "Disney+ Estándar", code: "15" },
    { name: "Disney+ Basico", code: "16" },
    { name: "Amazon Prime Video", code: "1" },
    { name: "Paramount+", code: "5" },
    { name: "Vix+", code: "6" },
    { name: "Plex", code: "7" },
    { name: "Crunchyroll", code: "8" },
    { name: "Black Code", code: "9" },
    { name: "Iptv", code: "10" },
    { name: "Rakuten Viki", code: "13" },
    { name: "Flujo TV", code: "14" },
    { name: "Mubi", code: "19" },
    { name: "Universal+", code: "21" },
    { name: "TvMia", code: "25" },
    { name: "DirectTv GO", code: "26" },
    { name: "Apple Tv", code: "27" },
    { name: "Netflix Extra", code: "28" },
    { name: "ChatGPT", code: "32" },
  ];

  const opcionesPlataformasAccount = [
    { name: "Netflix", code: "2" },
    { name: "Max Premium", code: "3" },
    { name: "Max Estándar", code: "17" },
    { name: "Disney+ Premium", code: "4" },
    { name: "Disney+ Estándar", code: "15" },
    { name: "Disney+ Basico", code: "16" },
    { name: "Amazon Prime Video", code: "1" },
    { name: "Paramount+", code: "5" },
    { name: "Vix+", code: "6" },
    { name: "Plex", code: "7" },
    { name: "Crunchyroll", code: "8" },
    { name: "Black Code", code: "9" },
    { name: "Iptv", code: "10" },
    { name: "Rakuten Viki", code: "13" },
    { name: "Flujo TV", code: "14" },
    { name: "Youtube Premium", code: "11" },
    { name: "Spotify", code: "12" },
    { name: "Tidal", code: "18" },
    { name: "Mubi", code: "19" },
    { name: "Canva", code: "20" },
    { name: "Universal+", code: "21" },
    { name: "Duolingo", code: "22" },
    { name: "Microsoft 365", code: "23" },
    { name: "McAfee", code: "24" },
    { name: "TvMia", code: "25" },
    { name: "DirectTv GO", code: "26" },
    { name: "Apple Tv", code: "27" },
    { name: "Netflix Extra", code: "28" },
    { name: "ChatGPT", code: "32" },
  ];

  const [procesing, setProcesing] = useState(false);
  const { success, error } = useSelector((state) => state.error);

  const dispatch = useDispatch();
  const toast = useRef(null);

  const handleErrors = useErrorHandler(error, success);

  const { categoriesProfile, categoriesAccount } = selectCategoriesCPs(
    combo.categoriesCPs
  );

  // Cargar los datos del combo en el formulario
  const [formData, setFormData] = useState({
    name: combo?.name || "",
    description: combo?.description || "",
    price: combo?.price || "",
    offerPrice: combo?.offerPrice || "0",
    comboImg: combo?.comboImg || "",
    idsCategoryProfile: categoriesProfile,
    idsCategoryAccount: categoriesAccount,
  });

  const [previewImage, setPreviewImage] = useState(formData.comboImg); // Estado para la vista previa de la imagen

  useEffect(() => {
    const { categoriesAccount, categoriesProfile } = selectCategoriesCPs(
      combo.categoriesCPs
    );

    if (combo) {
      setFormData({
        name: combo.name,
        description: combo.description,
        price: combo.price,
        offerPrice: combo.offerPrice || "0",
        comboImg: combo.imgCombos?.[0]?.urlImagen || "", // Asignar la URL de la imagen
        idsCategoryProfile: categoriesProfile || [],
        idsCategoryAccount: categoriesAccount || [],
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

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("offerPrice", formData.offerPrice);
    if (formData.comboImg instanceof File) {
      form.append("comboImg", formData.comboImg);
    }
    form.append(
      "idsCategoryProfile",
      JSON.stringify(
        formData.idsCategoryProfile.map((category) => category.code)
      )
    );
    form.append(
      "idsCategoryAccount",
      JSON.stringify(
        formData.idsCategoryAccount.map((category) => category.code)
      )
    );

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
          <label
            htmlFor="Descripcion"
            style={{ fontWeight: "bold", display: "block" }}
          >
            Precio Inflado
          </label>
          <InputNumber
            inputId="currency-cop"
            value={formData.offerPrice}
            onValueChange={(e) =>
              setFormData({ ...formData, offerPrice: e.target.value })
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
            Perfiles del combo
          </label>
          <MultiSelect
            value={formData.idsCategoryProfile}
            onChange={(e) => {
              // Evitar duplicados en tiempo real
              const uniqueValues = [...new Set(e.value)];
              setFormData({ ...formData, idsCategoryProfile: uniqueValues });
            }}
            options={opcionesPlataformas}
            optionLabel="name"
            placeholder="Seleccionar plataformas"
            style={{ width: "100%" }}
          />
        </div>
        <div style={{ width: "100%", marginBottom: "12px" }}>
          <label htmlFor="plataformas" style={{ fontWeight: "bold" }}>
            Cuentas del combo
          </label>
          <MultiSelect
            value={formData.idsCategoryAccount}
            onChange={(e) => {
              // Evitar duplicados en tiempo real
              const uniqueValues = [...new Set(e.value)];
              setFormData({ ...formData, idsCategoryAccount: uniqueValues });
            }}
            options={opcionesPlataformasAccount}
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
