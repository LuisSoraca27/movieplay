import { useEffect, useState, useMemo } from "react";
import ViewProduct from "../ViewProduct";
import {
  setProfilesThunk,
  deleteProfileThunk,
} from "../../features/user/profileSlice";
import { fetchCategories } from "../../features/categories/categoriesSlice";
import { useDispatch, useSelector } from "react-redux";
import CreateProfile from "./CreateProfile";
import EditProfile from "./EditProfile";
import UploadExcel from "../UploadExcel";
import ConfirmModal from "../ui/ConfirmModal";
import { addToast } from "@heroui/toast";

const ProfileProduct = () => {
  const dispatch = useDispatch();

  // Obtener categorías desde Redux
  const { categories } = useSelector((state) => state.categoriesCP);
  const profiles = useSelector((state) => state.profiles.profiles);

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

  // Estado para los datos del perfil
  const [dataProfile, setDataProfile] = useState({});

  // Estado para el modal editar
  const [openEdit, setOpenEdit] = useState(false);

  // Estado para el modal crear desde excel
  const [openExcel, setOpenExcel] = useState(false);

  const handleEdit = (data) => {
    setDataProfile(data);
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
      dispatch(deleteProfileThunk(deleteId))
        .then(() => {
          addToast({ title: 'Éxito', description: "Perfil eliminado correctamente", color: 'success' });
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

  // Cargar perfiles cuando cambia la categoría
  useEffect(() => {
    if (categoryPerfiles) {
      dispatch(setProfilesThunk(categoryPerfiles));
    }
  }, [dispatch, categoryPerfiles, reload]);

  return (
    <>
      <UploadExcel
        show={openExcel}
        onClose={() => setOpenExcel(false)}
        reCharge={() => setReload(!reload)}
        url="profile/uploadexcelprofile"
        title="Subir Perfiles (Excel)"
        templateEndpoint="profile/template"
      />
      <EditProfile
        show={openEdit}
        onClose={() => setOpenEdit(false)}
        reCharge={() => setReload(!reload)}
        data={dataProfile}
      />

      <CreateProfile
        show={show}
        onClose={() => setShow(false)}
        reCharge={() => setReload(!reload)}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        title="Eliminar Perfil"
        message="¿Estás seguro de que deseas eliminar este perfil? Esta acción no se puede deshacer."
        confirmColor="danger"
      />

      <ViewProduct
        category={categoryPerfiles}
        optionsCategory={optionsCategory}
        products={profiles}
        handleCategory={handleCategory}
        handleDelete={handleDeleteClick}
        handleEdit={handleEdit}
        setShow={setShow}
        handleExcel={() => setOpenExcel(true)}
        isEdit={true}
        seeEmail={true}
      />
    </>
  );
};

export default ProfileProduct;
