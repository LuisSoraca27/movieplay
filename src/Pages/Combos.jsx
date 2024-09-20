import { useEffect, useState } from 'react'
import { setComboThunk } from '../features/user/comboSlice'
import { useDispatch, useSelector } from 'react-redux'
import CardCombo from '../Components/CardCombo'
import '../style/combos.css'
import { setIsLoading } from '../features/isLoading/isLoadingSlice'
import IsLoading from '../Components/IsLoading'
import ModalProduct from './ModalProduct'
import { setBalanceThunk } from '../features/balance/balanceSlice'
import ViewNotificationImg from '../Components/Notifications/ViewNotificationImg'



const Combos = () => {

    const user = JSON.parse(localStorage.getItem('user'));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [reload, setReload] = useState(false);

    const handleCardClick = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };


    const dispatch = useDispatch()
    const combos = useSelector(state => state.combos)
    const isLoadingState = useSelector((state) => state.isLoading);

    useEffect(() => {
        dispatch(setBalanceThunk(user.id));
        dispatch(setIsLoading(true));
        dispatch(setComboThunk())
            .finally(() => {
                dispatch(setIsLoading(false));
            }
            )
    }, [reload])

    return (
        <>
            <ViewNotificationImg/>
            {
                isLoadingState ? <IsLoading /> :
                <>
                <div className="container-title">
                <h1>Combos </h1>
                <p>Encuentra aqui combos de tus plataformas de streaming favoritas</p>
                </div>
                    <div className='container-combos'>
                        {
                            combos.length > 0 ?
                                combos.map((combo) => (
                                    <CardCombo key={combo.id} combo={combo}
                                        onClick={() => handleCardClick({ product: combo, open: isModalOpen, type: 'combo' })}
                                    />
                                ))
                                : <h1 style={{ color: 'white', textShadow: ' 3px 3px 2px #000000' }}>No hay combos disponibles </h1>
                        }
                    </div>
                </>
            }
            {isModalOpen && (
                <ModalProduct
                    data={modalData}
                    onClose={() => setIsModalOpen(false)}
                    reCharge={() => setReload(!reload)}
                />
            )}
        </>
    );
};

export default Combos;