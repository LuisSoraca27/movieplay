import { useEffect, useState } from "react";
import "../style/orders.css";
import { useSelector, useDispatch } from "react-redux";
import {
  getOrdersById,
  searchOrdersByDate,
} from "../features/orders/OrdersSlice";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import Detailorder from "../Components/Order/Detailorder";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { downloadSales } from "../features/orders/OrdersSlice";
import { InputText } from "primereact/inputtext";
import formatDateForDB from "../utils/functions/formatDateForDB";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import IsLoading from "../Components/IsLoading";

const Order = () => {
  const [date, setDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => setShowModal(false);
  const [showModalExcel, setShowModalExcel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState(new Date());
  const [idForSearch, setIdForSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);

  const dispatch = useDispatch();

  const { ordersById, ordersByDate } = useSelector((state) => state.orders);

  const handleShow = (data) => {
    setData(data);
    setShowModal(true);
  };

  const handleDateChange = (e) => {
    if (e.value) {
      setSearchDate(e.value);
      dispatch(searchOrdersByDate(formatDateForDB(e.value)));
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value.trim();
    setIdForSearch(value);

    if (value) {
      dispatch(getOrdersById(value));
    } else {
      dispatch(searchOrdersByDate(formatDateForDB(searchDate)));
    }
  };

  const createdAtTemplate = (rowData) => {
    const createdAt = new Date(rowData.createdAt);
    const dia = createdAt.getDate();
    const mes = createdAt.toLocaleString("es-ES", { month: "long" });
    const anio = createdAt.getFullYear();
    const hora = createdAt.getHours();
    const minutos = createdAt.getMinutes();
    return `${dia} de ${mes} ${anio}, ${hora}:${minutos}`;
  };

  const modaldownloadExcel = () => {
    return (
      <>
        <Button
          label="Descargar ventas"
          icon="pi pi-download"
          onClick={() => setShowModalExcel(true)}
          style={{ marginLeft: "15px" }}
        />
        <br />
        <br />
        <Dialog
          header="Descargar ventas"
          visible={showModalExcel}
          onHide={() => setShowModalExcel(false)}
          style={{ width: "370px" }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px" }}
          >
            <p style={{ fontWeight: "bold" }}>
              ¿Para qué fecha te gustaría obtener los registros de ventas?
            </p>
            <Calendar
              value={date}
              onChange={(e) => setDate(e.value)}
              placeholder="Seleccione una fecha"
              dateFormat="dd/mm/yy"
              showIcon
              disabled={loading}
            />
            <hr />
            <Button
              label="Descargar"
              icon="pi pi-download"
              onClick={handleDownloadExcel}
              loading={loading}
              disabled={loading}
            />
          </div>
        </Dialog>
      </>
    );
  };

  const handleDownloadExcel = () => {
    setLoading(true);
    dispatch(downloadSales(date)).then(() => {
      setShowModalExcel(false);
      setLoading(false);
    });
  };

  useEffect(() => {
    // Inicializar la búsqueda por fecha al cargar el componente
    dispatch(searchOrdersByDate(formatDateForDB(searchDate)));
  }, [dispatch, searchDate]);

  useEffect(() => {
    setOrders(idForSearch ? ordersById : ordersByDate);
  }, [ordersById, ordersByDate, idForSearch]);

  useEffect(() => {
    setLoadingPage(true);
    setTimeout(() => {
      setLoadingPage(false);
    }, 1000);
  }, []);

  return (
    <>
      <Detailorder
        showModal={showModal}
        handleClose={handleClose}
        data={data}
      />
      <div className="container-orders-father">
        { loadingPage ? <IsLoading /> : (
           <div style={{ marginTop: "10px" }}>
           <span className="orders-title">
             <i className="pi pi-shopping-cart"></i>
             <h2>Ventas externas</h2>
           </span>
           <div className="orders-options">
             <IconField>
                 <InputIcon className="pi pi-search"> </InputIcon>
                 <InputText
                 placeholder="Buscar por ID"
                 className="input-search"
                 type="text"
                 value={idForSearch}
                 onChange={handleIdChange}
               />
             </IconField>
             <Calendar
               value={searchDate}
               onChange={handleDateChange}
               placeholder="Buscar por fecha"
               dateFormat="dd/mm/yy"
               showIcon
               style={{ marginLeft: "10px" }}
             />
             {modaldownloadExcel()}
           </div>
           <div className="card">
           <DataTable
             value={orders}
             className="p-datatable-striped"
             stripedRows
             paginator
             rows={10}
             rowsPerPageOptions={[20, 30, 50, 100]}
             size="small"
           >
             <Column
               field="id"
               header="ID de compra"
               body={(rowData) => rowData.id}
             />
             <Column field="nameProduct" header="Nombre del producto" />
             <Column field="username" header="Comprador" />
             <Column field="priceProduct" header="Precio" />
             <Column
               field="createdAt"
               header="Fecha de Compra"
               body={createdAtTemplate}
             />
             <Column
               header="Detalles"
               body={(rowData) => (
                 <Button
                   icon="pi pi-external-link"
                   text
                   onClick={() => handleShow(rowData)}
                   className="p-button-rounded p-button-info"
                   style={{ fontSize: "14px" }}
                 />
               )}
             />
           </DataTable>
           </div>
         </div>
        ) }
      </div>
    </>
  );
};

export default Order;
