import '../style/cardprofile.css';

/**
 * CardProfilePreview - Componente de previsualización de CardProfile con estilos dinámicos
 * 
 * @param {string} logoUrl - URL de la imagen del logo
 * @param {string} displayName - Nombre a mostrar
 * @param {string} backgroundType - Tipo de fondo: 'solid', 'linear-gradient', 'radial-gradient'
 * @param {string} backgroundColor - Color sólido de fondo
 * @param {Array} gradientColors - Array de colores para gradientes
 * @param {string} gradientDirection - Dirección del gradiente
 * @param {string} total - Cantidad disponible (para mostrar "X Disponibles")
 * @param {boolean} showAvailability - Si mostrar el indicador de disponibilidad
 * @param {string} scale - Escala de la card: 'normal', 'small', 'large'
 */
const CardProfilePreview = ({ 
    logoUrl, 
    displayName = 'Nueva Categoría',
    backgroundType = 'solid',
    backgroundColor = '#000000',
    gradientColors = ['#000000', '#333333'],
    gradientDirection = 'to bottom',
    logoSize = 'medium',
    total = '10',
    showAvailability = true,
    scale = 'normal',
    onClick
}) => {
    const isAvailable = total !== '0';

    // Generar estilo de fondo dinámicamente
    const getBackgroundStyle = () => {
        if (backgroundType === 'solid') {
            return { background: backgroundColor };
        }
        if (backgroundType === 'linear-gradient') {
            const colors = Array.isArray(gradientColors) ? gradientColors : ['#000000', '#333333'];
            return { 
                background: `linear-gradient(${gradientDirection}, ${colors.join(', ')})` 
            };
        }
        if (backgroundType === 'radial-gradient') {
            const colors = Array.isArray(gradientColors) ? gradientColors : ['#000000', '#333333'];
            return { 
                background: `radial-gradient(circle, ${colors.join(', ')})` 
            };
        }
        return { background: backgroundColor };
    };

    // Escala de la card
    const getScaleClass = () => {
        switch(scale) {
            case 'small': return 'card-profile-small';
            case 'large': return 'card-profile-large';
            default: return '';
        }
    };

    const getLogoSizeStyle = () => {
        switch(logoSize) {
            case 'small': return { width: '50%', maxHeight: '80px' };
            case 'large': return { width: '90%', maxHeight: '180px' };
            case 'full': return { width: '100%', maxHeight: '100%' };
            default: return { width: '75%', maxHeight: '130px' }; // medium
        }
    };

    const handleClick = () => {
        if (onClick) {
            onClick();
        }
    };

    return (
        <div
            className={`card-profile ${getScaleClass()} ${!isAvailable && showAvailability ? 'no-available' : ''}`}
            onClick={handleClick}
            style={{ 
                ...getBackgroundStyle(),
                cursor: onClick ? 'pointer' : 'default'
            }}
        >
            {/* Muesca superior */}
            <div className="container-eyelash">
                <div className="eyelash-circle"></div>
                <div className="eyelash"></div>
            </div>

            {/* Logo */}
            {logoUrl ? (
                <img src={logoUrl} alt={displayName} style={getLogoSizeStyle()} />
            ) : (
                <div className="card-profile-placeholder">
                    <svg 
                        width="60" 
                        height="60" 
                        viewBox="0 0 24 24" 
                        fill="none" 
                        stroke="rgba(255,255,255,0.3)" 
                        strokeWidth="1.5"
                    >
                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                        <circle cx="8.5" cy="8.5" r="1.5"/>
                        <polyline points="21,15 16,10 5,21"/>
                    </svg>
                    <span>Subir Logo</span>
                </div>
            )}

            {/* Texto de disponibilidad */}
            {showAvailability && (
                <strong>{total} Disponibles</strong>
            )}

            {/* Indicador de disponibilidad */}
            {showAvailability && (
                <span className="available"></span>
            )}
        </div>
    );
};

export default CardProfilePreview;
