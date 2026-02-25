import { useEffect, useState } from "react";
import IsLoading from "../Components/IsLoading";
import { useDispatch, useSelector } from "react-redux";
import CardProfilePreview from "../Components/CardProfilePreview";
import "../style/profile.css";
import "../style/cardprofile.css";
import { setAccountThunk, invalidateAccountsCache } from "../features/account/accountSlice";
import { setIsLoading } from "../features/isLoading/isLoadingSlice";
import ModalAccount from "./ModalAccount";
import { setBalanceThunk } from "../features/balance/balanceSlice";
import ViewNotificationImg from "../Components/Notifications/ViewNotificationImg";
import RegisterOrder from "../Components/Order/RegisterOrder";

// Configuración de visibilidad por categoría
const categoryVisibility = {
  hidden: [
    "regalo",
    "disney_plus",
    "Dbasico",
    "Destandar",
    "Dpremium",
    "star_plus",
    "iptvbasico",
    "iptvmes",
    "regalo2",
    "universal",
    "chatgpt",
    "jellyfin",
    "picsart",
    "directvgo",
  ],
  adminOnly: [],
  restricted: {},
};

const Account = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [reload, setReload] = useState(false);

  const dispatch = useDispatch();
  const accounts = useSelector((state) => state.accounts.length);
  const isLoadingState = useSelector((state) => state.isLoading);

  const isAccountVisible = (categoryName) => {
    if (categoryVisibility.hidden.includes(categoryName)) {
      return false;
    }
    if (categoryVisibility.adminOnly.includes(categoryName)) {
      return user?.role === "admin" || user?.role === "superadmin";
    }
    if (categoryName in categoryVisibility.restricted) {
      return categoryVisibility.restricted[categoryName](user);
    }
    return true;
  };

  const filterAccounts = () => {
    const visibleAccounts = accounts.filter((account) =>
      isAccountVisible(account.categoryName)
    );
    const accounts0 = visibleAccounts.filter((account) => account.total === "0");
    const accountsComplete = visibleAccounts.filter(
      (account) => account.total !== "0"
    );
    return [...accountsComplete, ...accounts0];
  };

  const handleCardClick = (account) => {
    setModalData({
      total: account.total,
      categoryName: account.categoryName,
      displayName: account.displayName,
      logoUrl: account.logoPublicUrl,
      backgroundType: account.backgroundType,
      backgroundColor: account.backgroundColor,
      gradientColors: account.gradientColors,
      gradientDirection: account.gradientDirection,
      open: true,
    });
    setIsModalOpen(true);
  };

  const renderModal = () => {
    if (user?.role === "admin") {
      return (
        <RegisterOrder
          data={modalData}
          onClose={() => setIsModalOpen(false)}
          typeAccountProp={"account"}
        />
      );
    }
    return (
      <ModalAccount
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        recharge={() => setReload(!reload)}
        data={modalData}
      />
    );
  };

  useEffect(() => {
    dispatch(setBalanceThunk(user?.id));
    dispatch(setIsLoading(true));
    // Si hay reload, invalidar caché para forzar datos frescos
    if (reload) {
      invalidateAccountsCache();
    }
    dispatch(setAccountThunk(reload)).finally(() => {
      dispatch(setIsLoading(false));
    });
  }, [dispatch, reload, user?.id]);

  return (
    <>
      <ViewNotificationImg />
      {isLoadingState ? (
        <IsLoading />
      ) : (
        <div className="p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Cuentas
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-3">
              Encuentra aquí cuentas de tu plataforma favorita
            </p>
          </div>

          <div className="container-profile">
            {filterAccounts().map((account, index) => {
              if (isAccountVisible(account.categoryName)) {
                return (
                  <CardProfilePreview
                    key={account.id || index}
                    logoUrl={account.logoPublicUrl}
                    displayName={account.displayName || account.categoryName}
                    backgroundType={account.backgroundType || 'solid'}
                    backgroundColor={account.backgroundColor || '#000000'}
                    gradientColors={account.gradientColors || ['#000000', '#333333']}
                    gradientDirection={account.gradientDirection || 'to bottom'}
                    logoSize={account.logoSize || 'medium'}
                    total={account.total}
                    showAvailability={true}
                    onClick={() => handleCardClick(account)}
                  />
                );
              }
              return null;
            })}
          </div>
        </div>
      )}
      {isModalOpen && renderModal()}
    </>
  );
};

export default Account;
