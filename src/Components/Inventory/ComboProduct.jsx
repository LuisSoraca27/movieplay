import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setComboThunk,
  deleteComboThunk,
} from "../../features/user/comboSlice";
import ViewProduct from "../ViewProduct";
import CreateCombo from "./CreateCombo";
import EditCombo from "./EditCombo";
import { Pagination } from "@heroui/react";
import ConfirmModal from "../ui/ConfirmModal";
import { addToast } from "@heroui/toast";

const ComboProduct = () => {
  const [reload, setReload] = useState(false);
  const [show, setShow] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [dataCombo, setDataCombo] = useState({});
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Estado para la paginación (HeroUI usa 1-based indexing)
  const [page, setPage] = useState(1);
  const rows = 10;

  const dispatch = useDispatch();
  const combos = useSelector((state) => state.combos);
  const totalCombos = useSelector((state) => state.totalItems);
  const { error, success } = useSelector((state) => state.error);

  const handleEdit = (data) => {
    setOpenEdit(true);
    setDataCombo(data);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteComboThunk(deleteId))
        .then(() => {
          addToast({ title: 'Éxito', description: "Combo eliminado correctamente", color: 'success' });
          setReload(!reload);
        })
        .finally(() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        });
    }
  };

  // Cargar combos al iniciar o cuando se recargue
  useEffect(() => {
    dispatch(setComboThunk(page));
  }, [dispatch, reload, page]);

  useEffect(() => {
    if (error) addToast({ title: 'Error', description: error, color: 'danger' });
    if (success) addToast({ title: 'Éxito', description: success, color: 'success' });
  }, [error, success]);

  const onPageChange = (newPage) => {
    setPage(newPage);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const totalPages = Math.ceil(totalCombos / rows) || 1;

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

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Combo"
        message="¿Estás seguro de que deseas eliminar este combo? Esta acción no se puede deshacer."
        confirmColor="danger"
      />

      <ViewProduct
        products={combos}
        handleDelete={handleDeleteClick}
        setShow={setShow}
        isEdit={true}
        handleEdit={handleEdit}
      />

      <div className="flex w-full justify-center mt-4 mb-4">
        <Pagination
          isCompact
          showControls
          showShadow
          color="primary"
          page={page}
          total={totalPages}
          onChange={onPageChange}
        />
      </div>
    </>
  );
};

export default ComboProduct;
