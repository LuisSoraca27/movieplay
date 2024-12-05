import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setComboThunk,
  deleteComboThunk,
} from "../../features/user/comboSlice";
import ViewProduct from "../ViewProduct";
import Swal from "sweetalert2";
import CreateCombo from "./CreateCombo";
import EditCombo from "./EditCombo";
import { Toast } from "primereact/toast";
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { Paginator } from "primereact/paginator";

const ComboProduct = () => {
  const [reload, setReload] = useState(false);
  const [show, setShow] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataCombo, setDataCombo] = useState({});
  
  // Estado para la paginación
  const [page, setPage] = useState(0);
  const [rows, setRows] = useState(10); 

  const toast = useRef(null);
  const dispatch = useDispatch();
  const combos = useSelector((state) => state.combos);
  const totalCombos = useSelector((state) => state.totalItems);

  const handleEdit = (data) => {
    setOpenEdit(true);
    setDataCombo(data);
  };

  const handleDelete = (id) => {
    const accept = () => {
        dispatch(deleteComboThunk(id)).finally(() => {
        toast.current.show({ severity: 'info', summary: 'Confirmado', detail: 'Combo eliminado', life: 3000 });
        setReload(!reload);
        });
    }
    confirmDialog({
        message: '¿Estas seguro de eliminar este combo?',
        header: 'Confirmación de Eliminación', 
        icon: 'pi pi-info-circle',
        defaultFocus: 'reject',
        acceptClassName: 'p-button-danger',
        accept,
    });
  };

  // Cargar combos al iniciar o cuando se recargue
  useEffect(() => {
    dispatch(setComboThunk(page + 1)); // Enviar la página al backend (page + 1 si backend empieza en 1)
  }, [dispatch, reload, page]);

  const onPageChange = (event) => {
    setPage(event.page);
    setRows(event.rows);

    // Desplazar al inicio de la página
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <CreateCombo
        show={show}
        onClose={() => setShow(false)}
        reCharge={() => setReload(!reload)}
      />

      <EditCombo
        show={openEdit}
        onClose={() => setOpenEdit(false)}
        reCharge={() => setReload(!reload)}
        combo={dataCombo}
      />
      <ViewProduct
        products={combos}
        handleDelete={handleDelete}
        setShow={setShow}
        isEdit={true}
        handleEdit={handleEdit}
      />
      <Toast ref={toast} />
      <ConfirmDialog />

      {/* Agrega el Paginator aquí */}
      <Paginator
        first={page * rows}
        rows={rows}
        totalRecords={totalCombos} // Total de registros para calcular el número de páginas
        onPageChange={onPageChange}
      />
    </>
  );
};

export default ComboProduct;
