import { useEffect, useState } from "react";
import { Button } from "primereact/button";
import { createComboThunk } from "../../features/user/comboSlice";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import { removeError, removeSuccess } from "../../features/error/errorSlice";
import { Dialog } from "primereact/dialog";
import { AccordionTab, Accordion } from "primereact/accordion";
import { InputText } from "primereact/inputtext";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

import { FileUpload } from "primereact/fileupload";

const CreateCombo = ({ show, onClose, reCharge }) => {
  const opcionesPlataformas = [
    { label: "Amazon Prime Video", value: "1" },
    { label: "Netflix", value: "2" },
    { label: "HBO", value: "3" },
    { label: "Disney Plus", value: "4" },
    { label: "Star+", value: "5" },
    { label: "Paramount+", value: "6" },
    { label: "Vix+", value: "7" },
    { label: "Plex", value: "8" },
    { label: "Crunchyroll", value: "9" },
    { label: "Lionsgate+", value: "10" },
    { label: "iptv", value: "11" },
    { label: "Youtube", value: "12" },
    { label: "Tidal", value: "13" },
    { label: "Spotify", value: "14" },
    { label: "Deezer", value: "15" },
    { label: "Apple Music", value: "16" },
    { label: "Canva", value: "17" },
    { label: "Xbox Game Pass", value: "18" },
    { label: "Apple TV", value: "19" },
    { label: "Pornhub", value: "20" },
    { label: "Brazzers", value: "21" },
    { label: "Rakuten Viki", value: "22" },
    { label: "Acorn TV", value: "23" },
    { label: "Mubi", value: "24" },
  ];

  const [procesing, setProcesing] = useState(false);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    comboImg: "",
  });

  const [accordionItems, setAccordionItems] = useState([]);

  const { success, error } = useSelector((state) => state.error);

  const handleErrors = () => {
    if (success) {
      Swal.fire({
        title: "Combo creado con exito",
        icon: "success",
        confirmButtonText: "Ok",
      });
      setFormData({
        name: "",
        description: "",
        price: "",
        comboImg: "",
      });
      setAccordionItems([]);
      dispatch(removeSuccess());
    } else if (error) {
      Swal.fire({
        title: "Error",
        text: error,
        icon: "error",
        confirmButtonText: "Ok",
      });
      dispatch(removeError());
    }
  };

  const handleInputChange = (e, index) => {
    const { name, value } = e.target;
    const updatedItems = [...accordionItems];
    updatedItems[index] = { ...updatedItems[index], [name]: value };
    setAccordionItems(updatedItems);
  };

  const addAccordionItem = () => {
    setAccordionItems([...accordionItems, {}]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setProcesing(true);
    const profiles = accordionItems.map((item) => {
      return {
        name: item.name,
        description: item.description,
        price: item.price,
        emailAccount: item.emailAccount,
        passwordAccount: item.passwordAccount,
        profileAccount: item.profileAccount,
        pincodeAccount: item.pincodeAccount,
        categoryId: item.categoryId,
      };
    });
    profiles.forEach((profile) => {
      profile.isCombo = true;
    });

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("price", formData.price);
    form.append("comboImg", formData.comboImg);
    form.append("profiles", JSON.stringify(profiles));

    console.log(JSON.stringify(form));
    console.log(formData);
    console.log(profiles);
    dispatch(createComboThunk(form)).finally(() => {
      reCharge();
      onClose();
      setProcesing(false);
    });
  };

  useEffect(() => {
    handleErrors();
  }, [success, error]);

  return (
    <Dialog
      visible={show}
      onHide={onClose}
      style={{ width: "80vw" }}
      header="Crear Combo"
      footer={
        <div>
          <Button
            label="Confirmar"
            icon="pi pi-check"
            onClick={handleSubmit}
            loading={procesing}
            autoFocus
            severity="success"
          />
        </div>
      }
    >
      <div className="container-form-combos">
        <div className="colum-form-1">
          <form encType="multipart/form-data">
            <div style={{ width: "100%", marginBottom: "20px" }}>
              <label className="style-label">Nombre</label>
              <InputText
                size="lg"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ width: "100%", marginBottom: "20px" }}>
              <label className="style-label">Descripción</label>
              <InputTextarea
                as={"textarea"}
                rows={3}
                type="text"
                name="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ width: "100%", marginBottom: "20px" }}>
              <label className="style-label">Precio</label>
              <InputText
                size="lg"
                type="number"
                name="price"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
                style={{ width: "100%" }}
              />
            </div>

            <div style={{ width: "100%", marginBottom: "20px" }}>
              <label className="style-label">Imagen del combo</label>
              <FileUpload
                mode="basic"
                name="comboImg"
                chooseLabel="Elegir"
                className="p-button-info"
                accept="image/*"
                maxFileSize={1000000}
                customUpload
                onSelect={(e) =>
                  setFormData({ ...formData, comboImg: e.files[0] })
                }
              />
            </div>
          </form>
        </div>
        <div className="colum-form-2">
          {accordionItems.map((item, index) => (
            <Accordion key={index}>
              <AccordionTab header={`Perfil ${index + 1}`}>
                <div>
                  <label>plataformas</label>
                  <Dropdown
                    name="categoryId"
                    value={item["categoryId"] || ""}
                    options={opcionesPlataformas}
                    onChange={(e) =>
                      handleInputChange(
                        { target: { name: "categoryId", value: e.value } },
                        index
                      )
                    }
                    placeholder="Selecciona una plataforma"
                    optionLabel="label"
                    style={{ width: "100%" }}
                  />
                </div>
                <br />
                <div>
                  <label>Nombre</label>
                  <InputText
                    type="text"
                    name={`name`}
                    value={item["name"] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </div>
                <br />
                <div>
                  <label>Descripcion</label>
                  <InputTextarea
                    name={`description`}
                    value={item["description"] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </div>
                <br />
                <div>
                  <label>Precio</label>
                  <InputText
                    type="number"
                    name={`price`}
                    value={item["price"] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </div>
                <br />
                <div>
                  <label>Correo de Cuenta</label>
                  <InputText
                    type="text"
                    name={`emailAccount`}
                    value={item["emailAccount"] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </div>
                <br />
                <div>
                  <label>Contraseña de Cuenta</label>
                  <InputText
                    type="text"
                    name={`passwordAccount`}
                    value={item["passwordAccount"] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </div>
                <br />
                <div>
                  <label>Perfil de la Cuenta</label>
                  <InputText
                    type="text"
                    name={`profileAccount`}
                    value={item["profileAccount"] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </div>
                <br />
                <div>
                  <label>Pin del Perfil</label>
                  <InputText
                    type="text"
                    name={`pincodeAccount`}
                    value={item["pincodeAccount"] || ""}
                    onChange={(e) => handleInputChange(e, index)}
                    style={{ width: "100%" }}
                  />
                </div>
              </AccordionTab>
            </Accordion>
          ))}
          <br />
          <Button
            label="Añadir Perfil"
            onClick={addAccordionItem}
            icon="pi pi-plus"
          ></Button>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateCombo;
