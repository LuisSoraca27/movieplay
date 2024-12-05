import { useEffect, useState } from "react";
import {
  setComboThunk,
  fetchCombosByNameThunk,
} from "../features/user/comboSlice";
import { useDispatch, useSelector } from "react-redux";
import CardCombo from "../Components/CardCombo";
import "../style/combos.css";
import { setIsLoading } from "../features/isLoading/isLoadingSlice";
import IsLoading from "../Components/IsLoading";
import ModalProduct from "./ModalProduct";
import { setBalanceThunk } from "../features/balance/balanceSlice";
import ViewNotificationImg from "../Components/Notifications/ViewNotificationImg";
import { InputText } from "primereact/inputtext";
import { Paginator } from "primereact/paginator";
import { useNavigate } from "react-router-dom";

const Combos = () => {


  const [reload, setReload] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10); 

  const dispatch = useDispatch();
  const combos = useSelector((state) => state.combos);
  const isLoadingState = useSelector((state) => state.isLoading);
  const totalCombos = useSelector((state) => state.totalItems);


  useEffect(() => {
    if (searchTerm.trim()) {
      dispatch(fetchCombosByNameThunk({ name: searchTerm, page: page + 1 }));
    } else {
      dispatch(setComboThunk(page + 1 ));
    }
  }, [searchTerm, reload, dispatch, page]);

  
  const onPageChange = (event) => {
    setPage(event.page);
    setRows(event.rows);

    if (searchTerm.trim()) {
      dispatch(fetchCombosByNameThunk(searchTerm, event.page + 1)); 
    } else {
      dispatch(setComboThunk(event.page + 1));
    }
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [page]);

  return (
    <>
      <ViewNotificationImg />
      {isLoadingState ? (
        <IsLoading />
      ) : (
        <div className="container-total-combo">
          <div className="container-title"></div>
          <div className="container-main">
            <div className="search-container">
              <h4>Filtrar Combos</h4>
              <InputText
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar combos..."
                style={{ width: "100%" }}
              />
            </div>
            <div className="combos-container">
              {combos.length > 0 ? (
                combos.map((combo) => (
                  <CardCombo
                    key={combo.id}
                    combo={combo}
                  />
                ))
              ) : (
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    textAlign: "center",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <h1
                    style={{
                      color: "white",
                      textShadow: "3px 3px 2px #000000",
                    }}
                  >
                    No hay combos disponibles
                  </h1>
                </div>
              )}
            </div>
          </div>
          <Paginator
            first={page * rows}
            rows={rows}
            totalRecords={totalCombos}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </>
  );
};

export default Combos;
