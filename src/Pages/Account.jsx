import { useEffect, useState } from "react";
import IsLoading from "../Components/IsLoading";
import { useDispatch, useSelector } from "react-redux";
import CardProfile from "../Components/CardProfile";
import max_premium from '../assets/img/max_premium.png';
import max_estandar from '../assets/img/max_estandar.png';
import crunchyroll from "../assets/img/crunchyroll.webp";
import paramount_plus from "../assets/img/paramount-plus.png";
import plex from "../assets/img/plex.png";
import vix from "../assets/img/vix.png";
import spotify from "../assets/img/spotify.webp";
import youtube from "../assets/img/youtube.png";
import { setAccountThunk } from "../features/account/accountSlice";
import { setIsLoading } from "../features/isLoading/isLoadingSlice";
import ModalAccount from "./ModalAccount";
import { setBalanceThunk } from "../features/balance/balanceSlice";
import rakuten from "../assets/img/rakuten.png";
import iptv from "../assets/img/iptv.webp";
import profenet from "../assets/img/profenet.png";
import Dbasico from "../assets/img/Dbasico.png";
import Destandar from "../assets/img/Destandar.png";
import flujotv from '../assets/img/flujotv.png';
import tidal from '../assets/img/tidal.png';
import mubi from '../assets/img/mubi.png';
import duolingo from '../assets/img/duolingo.png';
import canva from '../assets/img/canva.png';
import universal_plus from '../assets/img/universal_plus.png';
import microsoft365 from '../assets/img/microsoft365.png';
import mcafee from '../assets/img/mcafee.png';
import tvmia from '../assets/img/tvmia.png';
import DGOcompleto from '../assets/img/DGOcompleto.png';
import apple_tv from "../assets/img/apple_tv.png";
import ViewNotificationImg from "../Components/Notifications/ViewNotificationImg";

const Account = () => {
  const categoryImageMap = {
    max_premium: [max_premium, "Max Premium"],
    max_estandar: [max_estandar, "Max Estándar"],
    paramount_basico: [paramount_plus, "Paramount+"],
    crunchyroll: [crunchyroll, "Crunchyroll"],
    profenet: [profenet, "El profenet"],
    paramount_plus: [paramount_plus, "Paramount+"],
    vix: [vix, "Vix+"],
    plex: [plex, "Next Movie"],
    iptv: [iptv, "IPTV"],
    rakuten: [rakuten, "Rakuten Viki"],
    spotify: [spotify, "Spotify"],
    youtube: [youtube, "Youtube"],
    Dbasico: [Dbasico, "Disney+ Basico"],
    Destandar: [Destandar, "Disney+ Estándar"],
    magistv: [flujotv, 'Flujo TV'],
    tidal: [tidal, 'Tidal'],
    mubi: [mubi, 'Mubi'],
    duolingo: [duolingo, 'Duolingo'],
    canva: [canva, 'Canva'],
    universal: [universal_plus, 'Universal+'],
    microsoft365: [microsoft365, 'Microsoft 365'],
    mcafee: [mcafee, 'McAfee'],
    tvmia: [tvmia, 'TVMia'],
    directvgo:[DGOcompleto, 'DirectTvGO'],
    apple_tv: [apple_tv, "Apple TV"],
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
          <div className="container-title">
            <h1>Cuentas </h1>
            <p>Encuentra aqui cuentas de tu plataforma favorita</p>
          </div>
          <div className="container-profile">
            {filterAccounts().map((account, index) => {
              const img = categoryImageMap[account?.categoryName]?.[0];
              const title = categoryImageMap[account?.categoryName]?.[1];
              switch (account?.categoryName) {
                case "netflix":
                case "amazon_prime":
                case "Dpremium":
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
      {isModalOpen && (
        <ModalAccount
          data={modalData}
          onClose={() => setIsModalOpen(false)}
          reCharge={() => setReload(!reload)}
        />
      )}
    </>
  );
};

export default Account;
