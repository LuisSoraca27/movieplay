import { useEffect, useState } from "react";
import IsLoading from "../Components/IsLoading";
import { useDispatch, useSelector } from "react-redux";
import CardProfile from "../Components/CardProfile";
import { setAccountThunk } from "../features/account/accountSlice";
import { setIsLoading } from "../features/isLoading/isLoadingSlice";
import ModalAccount from "./ModalAccount";
import { setBalanceThunk } from "../features/balance/balanceSlice";
import rakuten from "../assets/img/rakuten.png";
import netflix from "../assets/img/netflix.png";
import amazon_prime from "../assets/img/amazon_prime.png";
import disney_plus from "../assets/img/disney_plus_p.webp";
import max_premium from "../assets/img/max_premium.png";
import max_estandar from "../assets/img/max_estandar.png";
import crunchyroll from "../assets/img/crunchyroll.webp";
import paramount_plus from "../assets/img/paramount-plus.png";
import plex from "../assets/img/plex.png";
import vix from "../assets/img/vix.png";
import iptv from "../assets/img/iptv.webp";
import profenet from "../assets/img/profenet.png";
import Dbasico from "../assets/img/Dbasico.png";
import Destandar from "../assets/img/Destandar.png";
import Dpremium from "../assets/img/Dpremium.png";
import flujotv from "../assets/img/flujotv.png";
import universal_plus from "../assets/img/universal_plus.png";
import mubi from "../assets/img/mubi.png";
import tvmia from "../assets/img/tvmia.png";
import microsoft365 from "../assets/img/microsoft365.png";
import DGOcompleto from "../assets/img/DGOcompleto.png";
import apple_tv from "../assets/img/apple_tv.png";
import duolingo from "../assets/img/duolingo.png";
import spotify from "../assets/img/spotify.webp";
import canva from "../assets/img/canva.png";
import mcafee from "../assets/img/mcafee.png";
import tidal from "../assets/img/tidal.png";
import youtube from "../assets/img/youtube.png";
import netflix_extra from "../assets/img/netflix_extra.png";
import ViewNotificationImg from "../Components/Notifications/ViewNotificationImg";
import RegisterOrder from "../Components/Order/RegisterOrder";

const Account = () => {

  const categoryImageMap = {
    netflix: [netflix, "Netflix"],
    amazon_prime: [amazon_prime, "Amazon Prime Video"],
    disney_plus: [disney_plus, "Disney+"],
    max_premium: [max_premium, "Max Premium"],
    max_estandar: [max_estandar, "Max Estandar"],
    crunchyroll: [crunchyroll, "Crunchyroll"],
    profenet: [profenet, "El profenet"],
    paramount_plus: [paramount_plus, "Paramount+"],
    vix: [vix, "Vix+"],
    plex: [plex, "Plex"],
    iptv: [iptv, "IPTV"],
    rakuten: [rakuten, "Rakuten Viki"],
    Dbasico: [Dbasico, "Disney+ Basico"],
    Destandar: [Destandar, "Disney+ Estándar"],
    Dpremium: [Dpremium, "Disney+ Premium"],
    magistv: [flujotv, "Flujo TV"],
    universal: [universal_plus, "Universal+"],
    mubi: [mubi, "Mubi"],
    tvmia: [tvmia, "TVMia"],
    directvgo: [DGOcompleto, "DirectTvGO"],
    apple_tv: [apple_tv, "Apple TV"],
    microsoft365: [microsoft365, "Microsoft 365"],
    duolingo: [duolingo, "Duolingo"],
    spotify: [spotify, "Spotify"],
    canva: [canva, "Canva"],
    mcafee: [mcafee, "McAfee"],
    youtube: [youtube, "YouTube Premium"],
    tidal: [tidal, "Tidal"],
    netflix_extra: [netflix_extra, "Netflix Internacional"],
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [reload, setReload] = useState(false);
  const [isCommunityPanelOpen, setIsCommunityPanelOpen] = useState(true);

  const filterAccounts = () => {
    const accounts0 = accounts.filter((account) => account.total === "0");
    const accountsComplete = accounts.filter(
      (account) => account.total !== "0"
    );
    return [...accountsComplete, ...accounts0];
  };

  const handleCardClick = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const dispatch = useDispatch();
  let accounts = useSelector((state) => state.accounts.length);
  const isLoadingState = useSelector((state) => state.isLoading);

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
    dispatch(setIsLoading(true)); // Establecer isLoading en true antes de realizar la solicitud
    dispatch(setAccountThunk()).finally(() => {
      dispatch(setIsLoading(false)); // Establecer isLoading en false cuando se complete la solicitud
    });
  }, [dispatch, reload]);

  return (
    <>
      <ViewNotificationImg />
      {isLoadingState ? (
        <IsLoading />
      ) : (
        <div>
          <div className="container-profile">
            <div className="container-title">
              <h1>Cuentas </h1>
              <p>Encuentra aqui cuentas de tu plataforma favorita</p>
            </div>
            {filterAccounts().map((account, index) => {
              const img = categoryImageMap[account?.categoryName]?.[0];
              const title = categoryImageMap[account?.categoryName]?.[1];
              switch (account?.categoryName) {
                case "regalo":
                case "disney_plus":
                case "Dpromocion":
                case "star_plus":
                case "iptvbasico":
                case "iptv":
                case "regalo2":
                  return null;
                default:
                  return (
                    <div key={index}>
                      <CardProfile
                        total={account.total}
                        background={account.categoryName}
                        img={img}
                        title={title}
                        onClick={() =>
                          handleCardClick({
                            total: account.total,
                            categoryName: account.categoryName,
                            background: account.categoryName,
                            img: img,
                            title: title,
                            open: isModalOpen,
                          })
                        }
                      />
                    </div>
                  );
              }
            })}
          </div>
        </div>
      )}
      {isModalOpen && renderModal()}
    </>
  );
};

export default Account;
