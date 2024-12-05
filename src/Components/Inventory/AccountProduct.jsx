import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setAccountsThunk,
  deleteAccountThunk,
} from "../../features/account/accountSlice";
import ViewProduct from "../ViewProduct";
import Swal from "sweetalert2";
import CreateAccount from "./CreateAccount";
import EditAccount from "./EditAccount";
import UploadExcel from "../UploadExcel";

const AccountProduct = () => {
  const [categoryPerfiles, setCategoryPerfiles] = useState("netflix");
  const [reload, setReload] = useState(false);
  const [show, setShow] = useState(false);

  const optionsCategory = [
    { name: 'Netflix', value: 'netflix' },
    { name: 'Max Premium', value: 'max_premium' },
    { name: 'Max Estandar', value:'max_estandar' },
    { name: 'amazon Prime Video', value: 'amazon_prime' },
    { name: 'Paramount+', value: 'paramount_plus' },
    { name: 'Vix+', value: 'vix' },
    { name: 'Plex', value: 'plex' },
    { name: 'Crunchyroll', value: 'crunchyroll' },
    { name: 'Black Code', value: 'profenet' },
    { name: 'IPTV', value: 'iptv' },
    { name: 'Rakuten Viki', value: 'rakuten' },
    { name: 'Disney+ Basico', value: 'Dbasico' },
    { name: 'Disney+ Estándar', value: 'Destandar' },
    { name: 'Disney+ Premium', value: 'Dpremium' },
    { name: 'Flujo TV', value: 'magistv' },
    { name: 'Spotify', value: 'spotify' },
    { name: 'youtube premium', value: 'youtube' },
    { name: 'Tidal', value: 'tidal' },
    { name: 'Mubi', value:'mubi' },
    { name: 'universal+', value: 'universal' },
    { name: 'Canva', value: 'canva' },
    { name: 'Duolingo', value: 'duolingo' },
    { name: 'Microsoft 365', value: 'microsoft' },
    { name: 'McAfee', value: 'mcafee' },
    { name: 'TvMia', value: 'tvmia'},
    { name: 'DirectTv GO', value: 'directvgo' },
    { name: 'Apple TV', value: 'apple_tv' },
  ];

  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.accounts);

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
    console.log(e.target.value);
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "¿Estas seguro?",
      text: "No podras revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "!Si, eliminar!",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        dispatch(deleteAccountThunk(id)).finally(() => {
          setReload(!reload);
        });
      }
    });
  };

  useEffect(() => {
    dispatch(setAccountsThunk(categoryPerfiles));
  }, [dispatch, categoryPerfiles, reload]);

  return (
    <>
      <UploadExcel
        show={openExcel}
        onClose={() => setOpenExcel(false)}
        reCharge={() => setReload(!reload)}
        url="account/uploadexcelaccount"
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
      <ViewProduct
        category={categoryPerfiles}
        optionsCategory={optionsCategory}
        products={accounts}
        handleCategory={handleCategory}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        handleExcel={() => setOpenExcel(true)}
        setShow={setShow}
        isEdit={true}
        seeEmail={true}
      />
    </>
  );
};

export default AccountProduct;
