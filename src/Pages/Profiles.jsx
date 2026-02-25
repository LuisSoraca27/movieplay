import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CardProfilePreview from "../Components/CardProfilePreview";
import { setProfileThunk, invalidateProfilesCache } from "../features/user/profileSlice";
import IsLoading from "../Components/IsLoading";
import "../style/profile.css";
import "../style/cardprofile.css";
import { setIsLoading } from "../features/isLoading/isLoadingSlice";
import ModalProfile from "./ModalProfile";
import { setBalanceThunk } from "../features/balance/balanceSlice";
import ViewNotificationImg from "../Components/Notifications/ViewNotificationImg";
import RegisterOrder from "../Components/Order/RegisterOrder";

// Configuración de visibilidad por categoría
const categoryVisibility = {
  hidden: [
    "tidal",
    "apple_music",
    "youtube",
    "dezzer",
    "canva",
    "calm",
    "duolingo",
    "star_plus",
    "disney_plus",
    "napster",
    "regalo2",
    "universal",
  ],
  adminOnly: ["regalo", "iptvbasico"],
  restricted: {},
};

const Profiles = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [reload, setReload] = useState(false);

  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profiles.length);
  const isLoadingState = useSelector((state) => state.isLoading);

  const isProfileVisible = (categoryName) => {
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

  const filterProfiles = () => {
    const visibleProfiles = profiles.filter((profile) =>
      isProfileVisible(profile.categoryName)
    );
    const profiles0 = visibleProfiles.filter((profile) => profile.total === "0");
    const profilesComplete = visibleProfiles.filter(
      (profile) => profile.total !== "0"
    );
    return [...profilesComplete, ...profiles0];
  };

  const renderModal = () => {
    if (user?.role === "admin") {
      return (
        <RegisterOrder
          data={modalData}
          onClose={() => setIsModalOpen(false)}
          typeAccountProp={"profile"}
        />
      );
    }
    return (
      <ModalProfile
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
      invalidateProfilesCache();
    }
    dispatch(setProfileThunk(reload)).finally(() => {
      dispatch(setIsLoading(false));
    });
  }, [dispatch, reload, user?.id]);

  const handleCardClick = (profile) => {
    setModalData({
      total: profile.total,
      categoryName: profile.categoryName,
      displayName: profile.displayName,
      logoUrl: profile.logoPublicUrl,
      backgroundType: profile.backgroundType,
      backgroundColor: profile.backgroundColor,
      gradientColors: profile.gradientColors,
      gradientDirection: profile.gradientDirection,
      open: true,
    });
    setIsModalOpen(true);
  };

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
              Perfiles
            </h1>
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-3">
              Encuentra aquí el perfil individual de tu plataforma favorita
            </p>
          </div>

          <div className="container-profile">
            {filterProfiles().map((profile, index) => {
              if (isProfileVisible(profile.categoryName)) {
                return (
                  <CardProfilePreview
                    key={profile.id || index}
                    logoUrl={profile.logoPublicUrl}
                    displayName={profile.displayName || profile.categoryName}
                    backgroundType={profile.backgroundType || 'solid'}
                    backgroundColor={profile.backgroundColor || '#000000'}
                    gradientColors={profile.gradientColors || ['#000000', '#333333']}
                    gradientDirection={profile.gradientDirection || 'to bottom'}
                    logoSize={profile.logoSize || 'medium'}
                    total={profile.total}
                    showAvailability={true}
                    onClick={() => handleCardClick(profile)}
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

export default Profiles;