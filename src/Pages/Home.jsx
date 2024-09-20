import { useEffect, useRef, useState } from 'react';
import { Messages } from 'primereact/messages';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationThunk } from '../features/notifications/notificationSlice';
import {Dialog} from 'primereact/dialog';
import { Image } from 'primereact/image';
import promo  from '../assets/promo.png';
import '../style/home.css';
import ViewNotificationImg from '../Components/Notifications/ViewNotificationImg';
import CommunitiesPanel from '../Components/CommunitiesPanel';
        

const Home = () => {
    const dispatch = useDispatch();
    const {notifications} = useSelector((state) => state.notification);
    const msgs = useRef(null);

    const [ visible, setVisible ] = useState(false);
    const [isCommunityPanelOpen, setIsCommunityPanelOpen] = useState(true);

    const notificaciones = notifications.map((notification) => {
        return {
            sticky: true,
            severity: 'info',
            icon: 'pi pi-bell',
            detail: notification.message,
            closable: false
        };
    });

    useEffect(() => {
        dispatch(getNotificationThunk());
    }, [dispatch]);


    useEffect(() => {
        if (msgs.current && notificaciones.length > 0) {
            msgs.current.clear();
            msgs.current.show(notificaciones);
        }
    }, [notificaciones, msgs.current]);

    useEffect(() => {
        setVisible(true);
    }, []);


    return (
        <>
        <ViewNotificationImg/>
        <div className="container-notification">
            <div className="notificationView">
                <h2>Notificaciones</h2>
                <p>Conoce nuestras promociones y noticias</p>
                <hr />
                <div className="notifications">
                    <Messages ref={msgs} />
                </div>
            </div>
            { isCommunityPanelOpen && <CommunitiesPanel onClose={() => setIsCommunityPanelOpen(false)}/> }
        </div>
        </>
    );
};

export default Home;
