import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { useEffect, useRef, useState } from "react";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Fieldset } from "primereact/fieldset";
import {
  uploadImgPopup,
  getNotificationImgThunk,
  deleteImgPopup,
} from "../../features/notifications/notificationSlice";
import { useDispatch, useSelector } from "react-redux";
import useErrorHandler from "../../Helpers/useErrorHandler";
import "../../style/notification.css";

// eslint-disable-next-line react/prop-types
const PopupNotification = ({ visible, setVisible }) => {
  const initialValue = [
    {
      imagen: null,
      linkImg: "",
    },
  ];

  const toast = useRef(null);
  const dispatch = useDispatch();
  const [images, setImages] = useState(initialValue);
  const { error, success } = useSelector((state) => state.error);
  const { notificationImg } = useSelector((state) => state.notification);
  const [loading, setLoading] = useState(false);
  const [visibleImg, setVisibleImg] = useState(false);

  const handleError = useErrorHandler(error, success, toast.current);

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  const handleDeleteImg = (id) => {
    setLoading(true);
    dispatch(deleteImgPopup(id))
      .then(() => {
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelUpload = () => {
    if (notificationImg.length === 0) {
      setImages(initialValue);
      setVisible(false);
      return;
    }
    setVisibleImg(true);
    setImages(initialValue);
  };

  const onUploadImg = (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    images.forEach((image, index) => {
      formData.append(`image-${index}`, image.imagen);
      formData.append(`linkImg-${index}`, image.linkImg);
    });
    console.log("formData", formData);

    dispatch(uploadImgPopup(formData)).then(() => {
      setLoading(false);
      setImages(initialValue);
    });
  };

  useEffect(() => {
    if (toast.current) {
      handleError(toast.current);
    }
  }, [handleError, error, success]);

  useEffect(() => {
    dispatch(getNotificationImgThunk());
  }, [dispatch]);

  useEffect(() => {
    notificationImg.length !== 0 ? setVisibleImg(true) : setVisibleImg(false);
  }, [notificationImg]);

  useEffect(() => {
    console.log(notificationImg);
  }, [notificationImg]);

  const footer = (
    <div>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        severity="danger"
        onClick={handleCancelUpload}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        severity="success"
        disabled={images.length === 0}
        onClick={onUploadImg}
        autoFocus
        loading={loading}
      />
    </div>
  );

  return (
    <div>
      <Toast ref={toast} />
      <Dialog
        visible={visible}
        header="Notificación Emergente"
        modal={true}
        onHide={() => setVisible(false)}
        footer={!visibleImg && footer}
      >
        <div className="p-fluid container-notification-popup">
          {visibleImg ? (
            <div className="container-imagenes">
              {notificationImg.map((imagen, index) => (
                <div
                  key={index}
                  className="card-notification-popup"
                  style={{ width: "47%", position: "relative" }}
                >
                  <img
                    src={imagen.urlImagen}
                    alt="Imagen de notificación"
                    style={{ width: "100%" }}
                  />
                  <Button
                    icon="pi pi-trash"
                    severity="danger"
                    style={{
                      position: "absolute",
                      top: "0",
                      right: "0",
                      margin: "10px",
                    }}
                    rounded
                    onClick={() => handleDeleteImg(imagen.id)}
                    disabled={loading}
                    loading={loading}
                  />
                </div>
              ))}
              <Button
                icon="pi pi-plus"
                severity="secondary"
                style={{ width: "47%", height: "200px" }}
                outlined
                onClick={() => setVisibleImg(false)}
              />
            </div>
          ) : (
            <form
              className="p-fluid"
              style={{ width: "100%" }}
              encType="multipart/form-data"
            >
              {images?.map((imagen, index) => (
                <div key={index} className="card-notification-popup">
                  <Fieldset
                    legend={`Imagen ${index + 1}`}
                    toggleable
                    style={{ width: "100%", position: "relative" }}
                  >
                    <div className="card flex justify-content-start">
                      <label
                        htmlFor="img"
                        style={{
                          width: "100%",
                          display: "block",
                          fontWeight: "bold",
                        }}
                      >
                        Imagen de notificación
                      </label>
                      <Toast ref={toast}></Toast>
                      <FileUpload
                        mode="basic"
                        url="/api/upload"
                        accept="image/*"
                        chooseLabel="Seleccionar imagen"
                        cancelLabel="Cancelar"
                        style={{ width: "100%" }}
                        onRemove={() => handleRemoveImage(index)}
                        onSelect={(e) => {
                          const newImages = [...images];
                          newImages[index].imagen = e.files[0];
                          setImages(newImages);
                        }}
                      />
                    </div>
                    <br />
                    <div>
                      <label
                        htmlFor="linkImg"
                        style={{
                          width: "100%",
                          display: "block",
                          fontWeight: "bold",
                        }}
                      >
                        Link de redirecion
                      </label>
                      <InputText
                        id="linkImg"
                        placeholder="https://"
                        value={images.linkImg}
                        onChange={(e) => {
                          const newImages = [...images];
                          newImages[index].linkImg = e.target.value;
                          setImages(newImages);
                        }}
                        type="url"
                      />
                    </div>
                    <Button
                      className="p-button-danger p-button-text"
                      icon="pi pi-times"
                      severity="danger"
                      onClick={() => handleRemoveImage(index)}
                      style={{ position: "absolute", top: "-25px", right: "0" }}
                    />
                  </Fieldset>
                </div>
              ))}
              <Button
                type="text"
                label="Agregrar imagen"
                icon="pi pi-plus"
                onClick={() =>
                  setImages([...images, { imagen: null, linkImg: "" }])
                }
              />
            </form>
          )}
        </div>
      </Dialog>
    </div>
  );
};

export default PopupNotification;
