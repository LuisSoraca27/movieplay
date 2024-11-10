import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import CardProfile from '../Components/CardProfile';
import { setProfileThunk } from '../features/user/profileSlice';
import IsLoading from '../Components/IsLoading';
import '../style/profile.css';
import '../style/cardprofile.css';
import netflix from '../assets/img/netflix.png';
import amazon_prime from '../assets/img/amazon_prime.png';
import disney_plus from '../assets/img/disney_plus_p.webp';
import max_premium from '../assets/img/max_premium.png';
import max_estandar from '../assets/img/max_estandar.png';
import crunchyroll from '../assets/img/crunchyroll.webp';
import paramount_plus from '../assets/img/paramount-plus.png';
import plex from '../assets/img/plex.png';
import vix from '../assets/img/vix.png';
import iptv from '../assets/img/iptv.webp';
import rakuten from '../assets/img/rakuten.png';
import profenet from '../assets/img/profenet.png';
import Dbasico from '../assets/img/Dbasico.png';
import Destandar from '../assets/img/Destandar.png';
import Dpremium from '../assets/img/Dpremium.png';
import flujotv from '../assets/img/flujotv.png';
import universal_plus from '../assets/img/universal_plus.png';
import mubi from '../assets/img/mubi.png';
import { setIsLoading } from '../features/isLoading/isLoadingSlice';
import ModalProfile from './ModalProfile';
import { setBalanceThunk } from '../features/balance/balanceSlice';
import ViewNotificationImg from '../Components/Notifications/ViewNotificationImg';

const categoryImageMap = {
  'netflix': [netflix, 'Netflix'],
  'amazon_prime': [amazon_prime, 'Amazon Prime Video'],
  'disney_plus': [disney_plus, 'Disney+'],
  'max_premium': [max_premium, 'Max Premium'],
  'max_estandar': [max_estandar, 'Max Estandar'],
  'crunchyroll': [crunchyroll, 'Crunchyroll'],
  'profenet': [profenet, 'El profenet'],
  'paramount_plus': [paramount_plus, 'Paramount+'],
  'vix': [vix, 'Vix+'],
  'plex': [plex, 'Next Movie'],
  'iptv': [iptv, 'IPTV'],
  'rakuten': [rakuten, 'Rakuten Viki'],
  'Dbasico': [Dbasico, 'Disney+ Basico'],
  'Destandar': [Destandar, 'Disney+ Estándar'],
  'Dpremium': [Dpremium, 'Disney+ Premium'],
  magistv: [flujotv, 'Flujo TV'],
  'universal': [universal_plus, 'Universal+'],
 'mubi': [mubi, 'Mubi'],
};

const Profiles = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [reload, setReload] = useState(false);
  const [isCommunityPanelOpen, setIsCommunityPanelOpen] = useState(true);

  const dispatch = useDispatch();
  const profiles = useSelector((state) => state.profiles.length);
  const isLoadingState = useSelector((state) => state.isLoading);


  useEffect(() => {
    dispatch(setBalanceThunk(user?.id));
    dispatch(setIsLoading(true));
    dispatch(setProfileThunk())
      .finally(() => {
        dispatch(setIsLoading(false));
      });
  }, [dispatch, reload, user?.id]);

  const handleCardClick = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const filterProfiles = () => {
    const profiles0 = profiles.filter(profile => profile.total === '0');
    const profilesComplete = profiles.filter(profile => profile.total !== '0');
    return [...profilesComplete, ...profiles0];
  };

  return (
    <>
      <ViewNotificationImg/>
      {isLoadingState ? <IsLoading /> :
        <div style={{ position: 'relative' }}>
          <div className="container-profile">
          <div className="container-title">
            <h1>Perfiles</h1>
            <p>Encuentra aquí el perfil individual de tu plataforma favorita</p>
          </div>
            {filterProfiles().map((profile, index) => {
              const img = categoryImageMap[profile?.categoryName]?.[0];
              const title = categoryImageMap[profile?.categoryName]?.[1];

              switch (profile.categoryName) {
                case 'spotify':
                case 'tidal':
                case 'apple_music':
                case 'youtube':
                case 'dezzer':
                case 'canva':
                case 'calm':
                case 'duolingo':
                case 'napster':
                case 'microsoft365':
                case 'mcafee':
                  return null;

                default:
                  return (
                    <CardProfile
                      key={index}
                      total={profile.total}
                      background={profile.categoryName}
                      img={img}
                      title={title}
                      onClick={() => handleCardClick({
                        total: profile.total,
                        categoryName: profile.categoryName,
                        background: profile.categoryName,
                        img: img,
                        title: title,
                        open: isModalOpen,
                      })}
                    />
                  );
              }
            })}
          </div>
        </div>
      }
      {isModalOpen &&
        <ModalProfile
          data={modalData}
          onClose={() => setIsModalOpen(false)}
          reCharge={() => setReload(!reload)}
        />
      }
    </>
  );
};

export default Profiles;
