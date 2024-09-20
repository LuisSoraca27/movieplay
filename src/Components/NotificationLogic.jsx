import React, { useEffect, useState } from 'react';
import io from 'socket.io-client'
import Swal from 'sweetalert2';
import notificacion from '../assets/audio/notificacion.mp3'
import useSound from 'use-sound';


const socket = io.connect('https://servidor-dk-soluciones-production.up.railway.app/')


const NotificationLogic = () => {

    const [play] = useSound(notificacion);
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    
    useEffect(() => {
        if (user) {
            if (user.role !== 'admin') {
                socket.on('receiveNotification', (notification) => {
                    play()
                    Swal.fire({
                        position: 'center',
                        icon: 'info',
                        title: 'Nueva notificacion',
                        html: `<h4>${notification.message}</h4>`,
                        showConfirmButton: true,
                    })
                })
            }
        }
    })
    return
};

export default NotificationLogic;