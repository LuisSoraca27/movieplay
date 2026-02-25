/**
 * Extrae el slug del kiosco desde el subdominio
 * ej: "burger-king.tudominio.com" → "burger-king"
 * @returns {string|null} El slug del kiosco o null si no hay subdominio
 */
export const getKioskSlug = () => {
    const hostname = window.location.hostname;
    const parts = hostname.split('.');

    // Detectar subdominio en producción/staging 
    // ej: tienda.tudominio.com (3 partes) vs tudominio.com (2 partes)
    // Excluir 'www' y 'app' si son usados por la aplicación principal
    if (parts.length >= 3 && parts[0] !== 'www' && parts[0] !== 'app') {
        return parts[0];
    }

    // Para desarrollo local con lvh.me (ej: tienda.lvh.me)
    // lvh.me apunta a 127.0.0.1
    if (hostname.includes('lvh.me') && parts.length >= 3) {
        return parts[0];
    }

    // Para desarrollo local con localhost (ej: localhost:5173/k/tienda)
    // En este caso NO hay subdominio, el routing lo maneja react-router

    return null;
};

/**
 * Verifica si estamos en un kiosco (subdominio) o en la app principal
 */
export const isKioskMode = () => {
    return getKioskSlug() !== null;
};
