import  { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import io from 'socket.io-client';
import '../style/notification.css';
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationThunk, deleteNotificationThunk } from '../features/notifications/notificationSlice';
import CustomNotification from '../Components/CustomNotification';
import PopupNotification from '../Components/Notifications/PopupNotification';

const socket = io.connect('https://servidor-dk-soluciones-production.up.railway.app/');

const Notification = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);
    const [notification, setNotification] = useState('');
    const [visible, setVisible] = useState(false);
    const toast = useRef(null);

    
    const sendNotification = (data) => {
        socket.emit('sendNotification', {
            title: 'Nueva notificación',
            message: data,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        sendNotification(notification);
        setNotification('');
    };

    const deleteNotification = (id) => {
        dispatch(deleteNotificationThunk(id));
    };

    useEffect(() => {
        dispatch(getNotificationThunk())
            .catch((error) => {
                console.error('Error al obtener notificaciones:', error);
            });
    }, [dispatch]);

    return (
        <>
        <PopupNotification  
         visible={visible}
         setVisible={setVisible}
        />
         <div className="container-notification">
            <div className="notificationView">
                <h2>Notificaciones</h2>

                <form onSubmit={handleSubmit} className="form">
                    <label htmlFor="notification">Crea una nueva notificación</label>
                    <textarea
                        type="text"
                        id="notification"
                        onChange={(e) => setNotification(e.target.value)}
                        value={notification}
                        required
                        rows={5}
                        placeholder="Escribe aquí tu notificación"
                    />
                    <Button onClick={handleSubmit} 
                    type="submit"
                    label="Enviar"
                    className="p-button-rounded p-button-success"
                    />
                    <hr />
                    <Button
                    type='button'
                    label='Ventana emergente'
                    className="p-button-rounded p-button-info"
                    onClick={() => setVisible(true)}
                />
                </form>
                <hr />
                <div className="notifications">
                    <h3>Notificaciones Activas</h3>
                    <Toast ref={toast} />
                    {notifications.map((notification, index) => (
                        <CustomNotification
                            key={index}
                            notification={notification}
                            onDelete={deleteNotification}
                        />
                    ))}
                </div>
            </div>
        </div>
        </>
    );
};

export default Notification;
