import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useDispatch, useSelector } from "react-redux";
import "../style/clients.css";
import { useEffect, useRef, useState } from "react";
import {
  getCustomers,
  deleteCustomer,
} from "../features/customer/customerSlice";
import { Tag } from "primereact/tag";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import useErrorHandler from "../Helpers/useErrorHandler";
import { InputText } from "primereact/inputtext";
import CreateCustomer from "../Components/Customers/CreateCustomer";
import EditCustomer from "../Components/Customers/EditCustomer";
import { FilterMatchMode } from "primereact/api";
import { IconField } from 'primereact/iconfield';
import { InputIcon } from 'primereact/inputicon';
import * as xlsx from "xlsx";
import jsPDF from "jspdf";

function Customer() {
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState({});

  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);
  const { error, success } = useSelector((state) => state.error);
  const toast = useRef(null);
  const [filters, setFilters] = useState({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [globalFilterValue, setGlobalFilterValue] = useState("");

  const handleErrors = useErrorHandler(error, success);

  const handleEdit = (rowData) => {
    setDataEdit(rowData);
    setShowEdit(true);
  };

  const handleDelete = (rowData) => {
    confirmDialog({
      message: "Estas seguro que deseas eliminar el cliente?",
      header: "Confirmación",
      icon: "pi pi-info-circle",
      defaultFocus: "reject",
      acceptClassName: "p-button-danger",
      accept: () => dispatch(deleteCustomer(rowData.id)),
    });
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };

    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  useEffect(() => {
    handleErrors(toast.current);
  }, [error, success]);

  // Función para exportar a Excel
  const exportExcel = () => {
    const worksheet = xlsx.utils.json_to_sheet(customers);
    const workbook = { Sheets: { data: worksheet }, SheetNames: ["data"] };
    const excelBuffer = xlsx.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    saveAsExcelFile(excelBuffer, "clientes");
  };

  // Función para guardar el archivo Excel
  const saveAsExcelFile = (buffer, fileName) => {
    import("file-saver").then((module) => {
      if (module && module.default) {
        let EXCEL_TYPE =
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
        let EXCEL_EXTENSION = ".xlsx";
        const data = new Blob([buffer], {
          type: EXCEL_TYPE,
        });

        module.default.saveAs(
          data,
          fileName + "_export_" + new Date().getTime() + EXCEL_EXTENSION
        );
      }
    });
  };


  const exportPdf = () => {
    const doc = new jsPDF();

    const columns = [
      { title: "Nombre", dataKey: "fullName" },
      { title: "Correo Electrónico", dataKey: "email" },
      { title: "Teléfono", dataKey: "phone" },
      { title: "Actividad", dataKey: "isActive" },
      { title: "Última Fecha de Compra", dataKey: "lastPurchaseDate" },
    ];

    const rows = customers.map((customer) => ({
      fullName: customer.fullName,
      email: customer.email,
      phone: customer.phone,
      isActive: customer.isActive === "activo" ? "Activo" : "Inactivo",
      lastPurchaseDate: customer.lastPurchaseDate
        ? new Date(customer.lastPurchaseDate).toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })
        : "No registra",
    }));

    doc.autoTable({
      columns,
      body: rows,
    });

    doc.save("clientes.pdf");
  };

  
  const header = (
    <div className=" header-datatable">
        <Button type="button" icon="pi pi-file-excel" severity="success" rounded onClick={exportExcel} data-pr-tooltip="XLS" />
        <Button type="button" icon="pi pi-file-pdf" severity="danger" rounded onClick={exportPdf} data-pr-tooltip="PDF" />
    </div>
);


  return (
    <div className="container-clients-father">
      <span className="clients-title">
        <i className="pi pi-users"></i>
        <h2>Clientes</h2>
      </span>
      <div
        className="orders-options"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <IconField>
          <InputIcon className="pi pi-search" />
          <InputText
            type="search"
            onInput={(e) => onGlobalFilterChange(e)}
            placeholder="Buscar..."
          />
        </IconField>
        <div className="export-buttons">
          <Button
            label="Crear nuevo cliente"
            icon="pi pi-plus"
            className="p-button-success"
            onClick={() => setShowCreate(true)}
          />
        </div>
      </div>
      <DataTable
      header={header}
        className="p-datatable-striped"
        stripedRows
        paginator
        rows={10}
        options={[20, 30, 50, 100]}
        size="small"
        emptyMessage="Sin resultados"
        value={customers}
        globalFilter={globalFilterValue}
      >
        <Column field="fullName" header="Nombre" />
        <Column field="email" header="Correo electrónico" />
        <Column field="phone" header="Teléfono" />
        <Column
          field="isActive"
          header="Actividad"
          body={(rowData) => {
            return rowData.isActive === "activo" ? (
              <Tag severity="success" value="Activo"></Tag>
            ) : (
              <Tag severity="danger" value="Inactivo"></Tag>
            );
          }}
        />
        <Column
          field="lastPurchaseDate"
          header="Ult. fecha de compra"
          body={(rowData) => {
            if (rowData.lastPurchaseDate != null) {
              const createdAt = new Date(rowData.lastPurchaseDate);
              const mes = createdAt.toLocaleString("es-ES", {
                month: "long",
              });
              const anio = createdAt.getFullYear();
              const dia = createdAt.getDate();
              return (
                <Tag
                  severity="info"
                  value={`${dia} de ${mes} ${anio}`}
                ></Tag>
              );
            } else {
              return <Tag severity="danger" value="No registra"></Tag>;
            }
          }}
        />
        <Column
          field="actions"
          header="Acciones"
          body={(rowData) => (
            <div className="p-grid p-justify-content-end">
              <Button
                icon="pi pi-pencil"
                className="p-button-primary"
                rounded
                onClick={() => handleEdit(rowData)}
                style={{ marginRight: "5px" }}
              />
              <Button
                icon="pi pi-trash"
                className="p-button-danger"
                rounded
                onClick={() => handleDelete(rowData)}
              />
            </div>
          )}
        />
      </DataTable>
      <CreateCustomer show={showCreate} onHide={() => setShowCreate(false)} />
      <EditCustomer
        show={showEdit}
        onHide={() => setShowEdit(false)}
        dataEdit={dataEdit}
      />
      <ConfirmDialog />
      <Toast ref={toast} />
    </div>
  );
}

export default Customer;
