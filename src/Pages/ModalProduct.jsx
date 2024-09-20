import { useEffect, useState } from "react";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import "../style/modalProfile.css";
import { useDispatch, useSelector } from "react-redux";
import { buyProductThunk } from "../features/user/comboSlice";
import Swal from "sweetalert2";
import { removeError, removeSuccess } from "../features/error/errorSlice";
import { InputText } from "primereact/inputtext";

const ModalProduct = ({ data, onClose, reCharge }) => {
  const { product, open, type } = data;

  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [purchase, setPurchase] = useState(false);
  // ...
  const [checked, setChecked] = useState(false); // Cambié "set" a "setChecked"
  // ...

  // En otra parte del código donde usas "set", deberías usar "setChecked" en su lugar

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
    if (error === "El usuario no tiene suficiente saldo") {
      Swal.fire({
        icon: "error",
        title: "Lo sentimos",
        text: "No tienes suficiente saldo para adquirir esta cuenta",
      });
      dispatch(removeError());
    } else if (!!error) {
      Swal.fire({
        icon: "error",
        title: "Lo sentimos",
        text: "Ha ocurrido un error, por favor intenta de nuevo",
      });
      dispatch(removeError());
    } else if (success) {
      Swal.fire({
        icon: "success",
        title: "¡Éxito!",
        text: "El producto se ha adquirido con éxito, Los datos del producto se han enviado a su correo electrónico",
        confirmButtonText: "Aceptar",
      });
      dispatch(removeSuccess());
    }
  };

  useEffect(() => {
    handleErrors();
  }, [error, success]);

  return (
    <Dialog
      visible={open}
      onHide={onClose}
      className="modal_profile"
      header={`Adquirir ${product?.name}`}
      modal
      footer={
        <div>
          <Button
            label="Adquirir"
            icon="pi pi-check"
            onClick={handleBuy}
            disabled={purchase}
            loading={purchase}
          />
        </div>
      }
    >
      <div className="container_modal_profile">
        <div className="container_img">
          <img
            src={
              product.imgCombos
                ? product.imgCombos[0].urlImagen
                : product.imgCourses
                ? product.imgCourses[0].urlImagen
                : product.imgLicenses
                ? product.imgLicenses[0].urlImagen
                : ""
            }
            width={"80%"}
            alt={product?.name}
          />
        </div>
        <div className="container_info">
          <h2 className="title-card">{product?.name}</h2>
          <div className="profile">
            <center>
              <p className="profile-value">
                Valor Producto seleccionado: <strong>${product.price}</strong>
              </p>
              <form
                className="email-tercero"
                style={{ width: "370px", textAlign: "start" }}
              >
                {!checked && (
                  <div className="checkbox-container">
                    <input
                      type="checkbox"
                      id="checkbox"
                      name="checkbox"
                      checked={checked}
                      onChange={() => setChecked(!checked)}
                    />
                    <label className="checkbox-label" htmlFor="checkbox">
                      Deseo enviar una copia de los datos de la compra
                    </label>
                  </div>
                )}
                {checked && (
                  <div className="copia-email hidden animation-duration-500 box">
                    <label htmlFor="username">Asunto</label>
                    <InputText
                      type="text"
                      placeholder="Asunto (opcional)"
                      className="input-email"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <br />
                    <br />
                    <label htmlFor="username">Correo electrónico</label>
                    <InputText
                      type="email"
                      placeholder="Correo electrónico"
                      className="input-email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                )}
              </form>
            </center>
          </div>
          <p>
            Al realizar el pedido, aceptas nuestros <b>Términos de Uso</b>.
          </p>
          <ul>
            <li>Guía de condiciones de uso restricciones y Garantía.</li>
            <li>
              No se aceptan devoluciones ni se hacen reembolsos de este
              producto.
            </li>
          </ul>
        </div>
      </div>
    </Dialog>
  );
};

export default ModalProduct;
