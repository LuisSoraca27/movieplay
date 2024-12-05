import { Calendar } from "primereact/calendar";
import "../style/outlay.css";
import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteOutlay, getOutlayForDay } from "../features/outlay/OutlaySlice";
import formatDateForDB from "../utils/functions/formatDateForDB";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { Column } from "primereact/column";
import { Tag } from "primereact/tag";
import { Dropdown } from "primereact/dropdown";
import CreateOutlay from "../Components/Outlay/CreateOutlay";
import useErrorHandler from "../Helpers/useErrorHandler";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import EditOutlay from "../Components/Outlay/EditOutlay";

function Outlay() {
  const toast = useRef(null);
  const dispatch = useDispatch();
  const { error, success } = useSelector((state) => state.error);
  const handleErrors = useErrorHandler(error, success);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataOutlayEdit, setDataOutlayEdit] = useState({});
  const { outlayForDay } = useSelector((state) => state.outlay);
  const [searchDate, setSearchDate] = useState(new Date());
  const [statuses] = useState(["pendiente", "pagado"]);
  const [statusesType] = useState([
    "nomina",
    "inventario",
    "pago a proveedores",
    "otros",
  ]);
  const [filters, setFilters] = useState({
    status: { value: null, matchMode: "equals" },
    type: { value: null, matchMode: "equals" },
  });

  const handleDateChange = (e) => {
    setSearchDate(e.value);
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

  const getSeverity = (value) => {
    switch (value) {
      case "pagado":
        return "success";
      case "pendiente":
        return "warning";
      case "pago a proveedores":
        return "#0b21a0e0";
      case "inventario":
        return "#333333";
      case "nomina":
        return "#4d1aa7";
      case "otros":
        return "#07310b";
      default:
        return "info";
    }
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
    );
  };
  const statusItemTemplate = (option) => {
    return <Tag value={option} severity={getSeverity(option)} />;
  };
  const typeBodyTemplate = (rowData) => {
    return (
      <Tag
        value={rowData.type}
        style={{ background: getSeverity(rowData.type) }}
      />
    );
  };
  const typeItemTemplate = (option) => {
    return <Tag value={option} style={{ background: getSeverity(option) }} />;
  };

  const statusRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={statusItemTemplate}
        className="p-column-filter"
        showClear
        placeholder="Todos"
        style={{ height: "43px", fontSize: "14px", width: "170px" }}
      />
    );
  };

  const typeRowFilterTemplate = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statusesType}
        onChange={(e) => options.filterApplyCallback(e.value)}
        itemTemplate={typeItemTemplate}
        className="p-column-filter"
        showClear
        placeholder="Todos"
        style={{ height: "43px", fontSize: "14px", width: "170px" }}
      />
    );
  };

  const handleEdit = (rowData) => {
    setDataOutlayEdit(rowData);
    setShowEditModal(true);
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: "Estas seguro que deseas eliminar el gasto?",
      header: "Confirmación",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => dispatch(deleteOutlay(rowData.id, searchDate)),
    });
  };

  useEffect(() => {
    if (searchDate) {
      dispatch(getOutlayForDay(formatDateForDB(searchDate)));
    }
  }, [searchDate, dispatch]);

  useEffect(() => {
    handleErrors(toast.current);
  }, [error, success]);

  return (
    <>
      <Toast ref={toast} />
      <ConfirmDialog />
      <CreateOutlay
        show={showModal}
        onHide={() => setShowModal(false)}
        searchDate={formatDateForDB(searchDate)}
      />
      <EditOutlay
      show={showEditModal}
      onHide={() => setShowEditModal(false)}
      searchDate={formatDateForDB(searchDate)}
      gastoAEditar={dataOutlayEdit}
      />
      <div className="container-outlay-father">
        <span className="outlay-title">
          <i className="pi pi-money-bill"></i>
          <h2>Gastos</h2>
        </span>
        <div className="orders-options">
          <Calendar
            value={searchDate}
            onChange={handleDateChange}
            placeholder="Filtar por dia"
            dateFormat="dd/mm/yy"
            showIcon
            style={{ width: "220px" }}
          />
          <Button
            label="Crear nuevo gasto"
            onClick={() => {
              setShowModal(true);
            }}
            icon="pi pi-plus"
            className="p-button-success"
            style={{ marginLeft: "10px" }}
          />
        </div>
        <DataTable
          className="p-datatable-striped"
          stripedRows
          paginator
          rows={10}
          rowsPerPageOptions={[20, 30, 50, 100]}
          size="small"
          emptyMessage="Sin resultados"
          value={outlayForDay}
          filters={filters}
          onFilter={(e) => setFilters(e.filters)}
          filterDisplay="row"
          responsive

        >
          <Column field="name" header="Nombre" />
          <Column
            field="amount"
            header="Monto"
            body={(rowData) => (
              <span>${new Intl.NumberFormat().format(rowData.amount)}</span>
            )}
          />
          <Column
            field="type"
            header="Tipo de gasto"
            filter
            filterField="type"
            body={typeBodyTemplate}
            filterElement={typeRowFilterTemplate}
            showFilterMenu={false}
          />
          <Column
            field="paymentMethod"
            header="Método de pago"
            body={(rowData) => (
              <b>{rowData.paymentMethod}</b>
            )}
            style={{ width: "150px" }}
            />
            <Column
            field="referendPayment"
            header="Referencia de pago"
            body={(rowData) => (
              <b>{rowData.referendPayment}</b>
            )}
            />
          <Column
            field="status"
            header="Estado"
            filter
            filterField="status"
            body={statusBodyTemplate}
            filterElement={statusRowFilterTemplate}
            showFilterMenu={false}
            style={{ width: "130px" }}
          />
          <Column
            field="createdAt"
            header="Fecha"
            body={createdAtTemplate}
            filterable={false}
            className="p-column-date"
            style={{ width: "150px" }}
          />
          <Column
            header="Acciones"
            body={(rowData) => (
              <div>
                <Button
                  rounded
                  icon="pi pi-pencil"
                  className="p-button-primary"
                  onClick={() => handleEdit(rowData)}
                  style={{ marginLeft: "5px" }}
                />
                <Button
                  rounded
                  icon="pi pi-trash"
                  className="p-button-danger"
                  onClick={() => handleDelete(rowData)}
                  style={{ marginLeft: "5px" }}
                />
              </div>
            )}
          />
        </DataTable>
      </div>
    </>
  );
}

export default Outlay;
