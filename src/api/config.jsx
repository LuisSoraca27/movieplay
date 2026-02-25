import axios from "axios";

const NODE_ENV = import.meta.env.VITE_NODE_ENV || 'development'

const baseURL = NODE_ENV === 'development' ? import.meta.env.VITE_URLDEV : import.meta.env.VITE_URLPROD
const socketURL = import.meta.env.VITE_SOCKET_URL || baseURL.replace('/api/v1/', '')

import { getKioskSlug } from "../utils/domain";

const dksoluciones = axios.create({
    baseURL,
});

export { socketURL };

// Interceptor para inyectar el slug del kiosco si existe y el token de autenticación
dksoluciones.interceptors.request.use((config) => {
    const slug = getKioskSlug();
    if (slug) {
        config.headers['X-Kiosk-Slug'] = slug;
    }

    // Inyectar token si existe
    const token = localStorage.getItem('token');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
});


// Interceptor para manejar expiración de sesión
dksoluciones.interceptors.response.use(
    (response) => response,
    (error) => {
        const status = error.response?.status;
        const message = error.response?.data?.message;
        const token = localStorage.getItem('token');

        // Solo cerrar sesión si:
        // - Error 401 (token inválido/expirado)
        // - Error 403 con mensaje específico de sesión expirada
        const isSessionExpired = status === 401 ||
            (status === 403 && message === 'Session expired');

        const isSubscriptionBlocked = status === 402;

        if (isSubscriptionBlocked) {
            localStorage.setItem('subscriptionBlocked', 'true');
            window.location.href = '/suscripcion-vencida';
            return Promise.reject(error);
        }

        if (isSessionExpired && token) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('auth');
            localStorage.removeItem('subscription');
            localStorage.removeItem('subscriptionBlocked');

            window.location.href = '/login';
        }

        // Para errores 403 de permisos, solo propagar el error (no cerrar sesión)
        // El componente mostrará el mensaje de error apropiado
        return Promise.reject(error);
    }
);

export default dksoluciones;