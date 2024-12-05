import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "../style/cardcombos.css";
import { Badge } from "primereact/badge";
import { useAuthContext } from "../context/AuthContext";
import ModalCombo from "./Inventory/combos/ModalCombo";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterOrderByCombo from "./Order/RegisterOrderByCombo";

// eslint-disable-next-line react/prop-types
const CardCombo = ({ combo, onClick }) => {

  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(null);
  const [showRegisterOrder, setShowRegisterOrder] = useState(false);

  const { userAuth } = useAuthContext();
  const isUserAdmin = userAuth?.role === "admin";

  const handleBuyClick = () => {
    if (isUserAdmin) {
      setShowRegisterOrder(true);
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className="card card-combos" onClick={onClick}>
        <div className="product-stock">
          {combo.hasMatchingProfiles ? (
            <Badge severity="success" value="Disponible"></Badge>
          ) : (
            <Badge severity="danger" value="No disponible"></Badge>
          )}
        </div>
        <div className="combo-image">
          <img alt="Combo" src={combo.imgCombos[0].urlImagen} />
        </div>
        <br />
        <div className="product-name">{combo.name}</div>
        <div className="product-price">
          $
          {new Intl.NumberFormat("co-CO", { currency: "COP" }).format(
            combo.price
          )}
        </div>

          <div style={{ marginTop: "10px" }}>
            <Button
              className="p-button-rounded p-button-primary"
              label="Ver detalle"
              size="small"
              outlined
              style={{ marginRight: "5px" }}
              onClick={() =>
                navigate(`/combos/${combo.id}`, { replace: true })
              }
            />
            <Button
              className="p-button-rounded p-button-success"
              label="Comprar"
              size="small"
              outlined
              onClick={handleBuyClick}
            />
          </div>
        
      </div>
      {isUserAdmin && (
        <RegisterOrderByCombo
          product={combo}
          show={showRegisterOrder}
          onClose={() => setShowRegisterOrder(false)}
        />
      )}

      {!isUserAdmin && (
        <ModalCombo
          combo={combo}
          show={showModal}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default CardCombo;
