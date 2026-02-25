import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccountsThunk,
  deleteAccountThunk,
} from "../../features/account/accountSlice";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import ViewProduct from "../ViewProduct";
import CreateAccount from "./CreateAccount";
import EditAccount from "./EditAccount";
import UploadExcel from "../UploadExcel";
import ConfirmModal from "../ui/ConfirmModal";
import { addToast } from "@heroui/toast";

const AccountProduct = () => {
  const dispatch = useDispatch();

  // Obtener categorías desde Redux
  const { categories } = useSelector((state) => state.categoriesCP);
  const accounts = useSelector((state) => state.accounts.accounts);

  // Convertir categorías al formato esperado por ViewProduct
  const optionsCategory = useMemo(() => {
    if (!categories || categories.length === 0) {
      return [{ name: "Cargando...", value: "" }];
    }
    return categories.map(cat => ({
      name: cat.displayName || cat.name,
      value: cat.name
    }));
  }, [categories]);

  const [categoryPerfiles, setCategoryPerfiles] = useState("");
  const [reload, setReload] = useState(false);
  const [show, setShow] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Estado para los datos de la cuenta
  const [dataAccount, setDataAccount] = useState({});

  // Estado para el modal editar
  const [openEdit, setOpenEdit] = useState(false);

  // Estado para el modal crear desde excel
  const [openExcel, setOpenExcel] = useState(false);

  const handleEdit = (data) => {
    setDataAccount(data);
    setOpenEdit(true);
  };

  const handleCategory = (e) => {
    setCategoryPerfiles(e.target.value);
  };

  const handleDeleteClick = (id) => {
    setDeleteId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deleteId) {
      dispatch(deleteAccountThunk(deleteId))
        .then(() => {
          addToast({ title: 'Éxito', description: "Cuenta eliminada correctamente", color: 'success' });
          setReload(!reload);
        })
        .finally(() => {
          setIsDeleteModalOpen(false);
          setDeleteId(null);
        });
    }
  };

  // Cargar categorías al montar
  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Establecer primera categoría como default cuando se cargan
  useEffect(() => {
    if (categories?.length > 0 && !categoryPerfiles) {
      setCategoryPerfiles(categories[0].name);
    }
  }, [categories, categoryPerfiles]);

  // Cargar cuentas cuando cambia la categoría
  useEffect(() => {
    if (categoryPerfiles) {
      dispatch(setAccountsThunk(categoryPerfiles));
    }
  }, [dispatch, categoryPerfiles, reload]);

  return (
    <>
      <UploadExcel
        show={openExcel}
        onClose={() => setOpenExcel(false)}
        reCharge={() => setReload(!reload)}
        url="account/uploadexcelaccount"
        title="Subir Cuentas (Excel)"
        templateEndpoint="account/template"
      />

      <EditAccount
        data={dataAccount}
        show={openEdit}
        onClose={() => setOpenEdit(false)}
        reCharge={() => setReload(!reload)}
      />
      <CreateAccount
        show={show}
        onClose={() => setShow(false)}
        reCharge={() => setReload(!reload)}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Cuenta"
        message="¿Estás seguro de que deseas eliminar esta cuenta? Esta acción no se puede deshacer."
        confirmColor="danger"
      />

      <ViewProduct
        category={categoryPerfiles}
        optionsCategory={optionsCategory}
        products={accounts}
        handleCategory={handleCategory}
        handleEdit={handleEdit}
        handleDelete={handleDeleteClick}
        handleExcel={() => setOpenExcel(true)}
        setShow={setShow}
        isEdit={true}
        seeEmail={true}
      />
    </>
  );
};

export default AccountProduct;
