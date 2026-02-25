import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import notificacion from '../assets/audio/notificacion.mp3'
import useSound from 'use-sound';
import socket from '../api/socket';


const NotificationLogic = () => {

    const [play] = useSound(notificacion);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

    useEffect(() => {
        if (user && (user.role !== 'admin' && user.role !== 'superadmin')) {
            const handleNotification = (notification) => {
                play()
                Swal.fire({
                    position: 'center',
                    icon: 'info',
                    title: 'Nueva notificacion',
                    html: `<h4>${notification.message}</h4>`,
                    showConfirmButton: true,
                })
            }

            socket.on('receiveNotification', handleNotification);

            return () => {
                socket.off('receiveNotification', handleNotification);
            }
        }
    }, [user, play])
    return
};

export default NotificationLogic;