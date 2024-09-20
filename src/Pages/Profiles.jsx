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
import hbo from '../assets/img/hbo.png';
import crunchyroll from '../assets/img/crunchyroll.webp';
import paramount_plus from '../assets/img/paramount-plus.png';
import plex from '../assets/img/plex.png';
import star_plus from '../assets/img/star-plus.png';
import vix from '../assets/img/vix.png';
import iptv from '../assets/img/iptv.webp';
import universal from '../assets/img/universal_plus.png';
import pornhub from '../assets/img/pornhub.png';
import apple_tv from '../assets/img/apple_tv.png';
import combo_plus from '../assets/img/combo_plus.png';
import mubi from '../assets/img/mubi.png';
import rakuten from '../assets/img/rakuten.png';
import regalo from '../assets/img/regalo.png';
import profenet from '../assets/img/profenet.png';
import tvmia from '../assets/img/tvmia.png';
import Dbasico from '../assets/img/Dbasico.png';
import Destandar from '../assets/img/Destandar.png';
import Dpremium from '../assets/img/Dpremium.png';
import microsoft365 from '../assets/img/microsoft365.png';
import wasender from '../assets/img/wasender.png';
import { setIsLoading } from '../features/isLoading/isLoadingSlice';
import ModalProfile from './ModalProfile';
import { setBalanceThunk } from '../features/balance/balanceSlice';
import ViewNotificationImg from '../Components/Notifications/ViewNotificationImg';
import CommunitiesPanel from '../Components/CommunitiesPanel';

const categoryImageMap = {
  'netflix': [netflix, 'Netflix'],
  'amazon_prime': [amazon_prime, 'Amazon Prime Video'],
  'disney_plus': [disney_plus, 'Disney+'],
  'hbo_max': [hbo, 'MAX'],
  'crunchyroll': [crunchyroll, 'Crunchyroll'],
  'profenet': [profenet, 'El profenet'],
  'paramount_plus': [paramount_plus, 'Paramount+'],
  'vix': [vix, 'Vix+'],
  'plex': [plex, 'Next Movie'],
  'star_plus': [star_plus, 'Star+'],
  'iptv': [iptv, 'IPTV'],
  'apple_tv': [apple_tv, 'Apple TV'],
  'pornhub': [pornhub, 'Pornhub'],
  'rakuten': [rakuten, 'Rakuten Viki'],
  'mubi': [mubi, 'Mubi'],
  'universal': [universal, 'Universal+'],
  'combo_plus': [combo_plus, 'Combo+'],
  'Dbasico': [Dbasico, 'Disney+ Basico'],
  'Destandar': [Destandar, 'Disney+ Estándar'],
  'Dpremium': [Dpremium, 'Disney+ Premium'],
  'tvmia': [tvmia, 'TVMia'],
  'regalo': [regalo, 'Regalo'],
  'microsoft365': [microsoft365, 'Microsoft 365'],
  'wasender': [wasender, 'WASender'],
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
                case 'star_plus':
                case 'disney_plus':
                case 'napster':
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
           { isCommunityPanelOpen && <CommunitiesPanel onClose={() => setIsCommunityPanelOpen(false)}/> }
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
