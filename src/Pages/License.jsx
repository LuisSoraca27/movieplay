import React, { useEffect, useState } from 'react';
import { setLicenseThunk } from '../features/license/licenseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '../features/isLoading/isLoadingSlice';
import CardLicense from '../Components/CardLicense';
import '../style/licenses.css';
import IsLoading from '../Components/IsLoading';
import ModalProduct from './ModalProduct'
import { setBalanceThunk } from '../features/balance/balanceSlice'
import ViewNotificationImg from '../Components/Notifications/ViewNotificationImg';
import CommunitiesPanel from '../Components/CommunitiesPanel';


const License = () => {

    const user = JSON.parse(localStorage.getItem('user'));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [reload, setReload] = useState(false);
    const [isCommunityPanelOpen, setIsCommunityPanelOpen] = useState(true);

    const handleCardClick = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    const dispatch = useDispatch();
    const licenses = useSelector(state => state.licenses);
    const isLoadingState = useSelector(state => state.isLoading);

    useEffect(() => {
        dispatch(setBalanceThunk(user.id));
        dispatch(setIsLoading(true)); // Establecer isLoading en true antes de realizar la solicitud
        dispatch(setLicenseThunk())
            .finally(() => {
                dispatch(setIsLoading(false)); // Establecer isLoading en false cuando se complete la solicitud
            });
    }, [dispatch, reload]);

    return (
        <>
            <ViewNotificationImg/>
            {isLoadingState ? <IsLoading /> :
                <div className='container-licenses'>
                    {
                        licenses.length > 0 ? licenses.map(license => (
                            <CardLicense key={license.id} license={license}
                                onClick={() => handleCardClick({ product: license, open: isModalOpen, type: 'license' })}
                            />
                        )) : <h1 style={{ color: 'white', textShadow: ' 3px 3px 2px #000000' }}>No hay licencias disponibles </h1>
                    }
                      { isCommunityPanelOpen && <CommunitiesPanel onClose={() => setIsCommunityPanelOpen(false)}/> }
                </div>}
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

export default License;
