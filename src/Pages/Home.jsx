import { useEffect, useState } from 'react';
import { Chip } from "@heroui/react";
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationThunk } from '../features/notifications/notificationSlice';
import '../style/home.css';
import ViewNotificationImg from '../Components/Notifications/ViewNotificationImg';
import { Bell, Info } from 'lucide-react';

const Home = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);

    const [visible, setVisible] = useState(false);

    useEffect(() => {
        dispatch(getNotificationThunk());
    }, [dispatch]);

    useEffect(() => {
        setVisible(true);
    }, []);

    return (
        <>
            <ViewNotificationImg />
            <div className="container-notification">
                <div className="notificationView">
                    <h2 className="flex items-center gap-2">
                        <Bell className="text-primary" />
                        Notificaciones
                    </h2>
                    <p>Conoce nuestras promociones y noticias</p>
                    <hr />
                    <div className="notifications flex flex-col gap-3 mt-4">
                        {notifications.length === 0 ? (
                            <div className="text-center py-8 text-gray-500">
                                <Info size={32} className="mx-auto mb-2" />
                                <p>No hay notificaciones disponibles</p>
                            </div>
                        ) : (
                            notifications.map((notification, index) => (
                                <div
                                    key={index}
                                    className="flex items-start gap-3 p-3 bg-primary-50 rounded-lg border-l-4 border-primary"
                                >
                                    <Bell size={20} className="text-primary mt-1 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-gray-800">{notification.message}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
