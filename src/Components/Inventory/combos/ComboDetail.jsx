import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchComboByIdThunk } from "../../../features/user/comboSlice";
import "../../../style/ComboDetail.css";
import { getCategoryColor } from "../../../utils/functions/selectNameCategoryOptions";
import { Badge } from "primereact/badge";
import { Button } from "primereact/button";
import RegisterOrderByCombo from "../../Order/RegisterOrderByCombo";
import ModalCombo from "./ModalCombo";
import { useAuthContext } from "../../../context/AuthContext";

function ComboDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const combo = useSelector((state) => state.combos[0]);

  const [showRegisterOrder, setShowRegisterOrder] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const { userAuth } = useAuthContext();

  const isUserAdmin = userAuth?.role === "admin";

  useEffect(() => {
    if (id) {
      dispatch(fetchComboByIdThunk(id));
    }
  }, [id, dispatch]);

  const handleBuyClick = () => {
    if (isUserAdmin) {
      setShowRegisterOrder(true);
    } else {
      setShowModal(true);
    }
  };

  if (!combo) {
    return <p className="loading">Cargando combo...</p>;
  }

  return (
    <>
      <div className="combo-detail-container card">
        <div className="combo-image-section">
          <img
            src={combo.imgCombos[0]?.urlImagen || "/placeholder.jpg"}
            alt={combo.name}
            className="combo-image"
          />
        </div>

        <div className="combo-info-section">
          <h1 className="combo-title">
            {combo.name}{" "}
            <Badge
              value={combo.hasMatchingProfiles ? "Disponible" : "No Disponible"}
              severity={combo.hasMatchingProfiles ? "success" : "danger"}
              style={{
                marginLeft: "10px",
                position: "relative",
                bottom: "7px",
              }}
            />
          </h1>
          <p className="combo-description">
            {combo.description || "Descripción no disponible"}
          </p>
          <div className="combo-price">
            ${new Intl.NumberFormat().format(combo.price) || "N/A"}
          </div>

          <Button
            label="Comprar"
            severity="success"
            rounded
            icon="pi pi-shopping-cart"
            style={{ width: "140px" }}
            disabled={!combo.hasMatchingProfiles}
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
}

export default ComboDetail;
