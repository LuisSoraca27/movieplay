import { useEffect, useState } from 'react';
import { setLicenseThunk } from '../features/license/licenseSlice';
import { useDispatch, useSelector } from 'react-redux';
import { setIsLoading } from '../features/isLoading/isLoadingSlice';
import CardLicense from '../Components/CardLicense';
import IsLoading from '../Components/IsLoading';
import ModalProduct from './ModalProduct';
import { setBalanceThunk } from '../features/balance/balanceSlice';
import ViewNotificationImg from '../Components/Notifications/ViewNotificationImg';
import { Package } from 'lucide-react';

const License = () => {
    const user = JSON.parse(localStorage.getItem('user'));

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalData, setModalData] = useState(null);
    const [reload, setReload] = useState(false);

    const handleCardClick = (data) => {
        setModalData(data);
        setIsModalOpen(true);
    };

    const dispatch = useDispatch();
    const licenses = useSelector(state => state.licenses);
    const isLoadingState = useSelector(state => state.isLoading);

    useEffect(() => {
        dispatch(setBalanceThunk(user.id));
        dispatch(setIsLoading(true));
        dispatch(setLicenseThunk())
            .finally(() => {
                dispatch(setIsLoading(false));
            });
    }, [dispatch, reload]);

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
                            Otros Servicios
                        </h1>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-3">
                            Explora nuestra selección de más servicios disponibles
                        </p>
                    </div>

                    {licenses.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {licenses.map(license => (
                                <CardLicense
                                    key={license.id}
                                    license={license}
                                    onClick={() => handleCardClick({ product: license, open: true, type: 'license' })}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-20 text-default-400">
                            <Package size={64} className="mb-4 opacity-50" />
                            <p className="text-xl font-medium">No hay servicios disponibles</p>
                            <p className="text-sm">Vuelve más tarde para ver nuevas ofertas</p>
                        </div>
                    )}
                </div>
            )}
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
