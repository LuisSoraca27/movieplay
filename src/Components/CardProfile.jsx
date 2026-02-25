import '../style/cardprofile.css'

const CardProfile = ({ background = 'netflix', img, title, total, logoSize = 'medium', onClick }) => {
    const isAvailable = total !== '0';

    const getLogoSizeStyle = () => {
        switch(logoSize) {
            case 'small': return { width: '50%', maxHeight: '80px' };
            case 'large': return { width: '90%', maxHeight: '180px' };
            case 'full': return { width: '100%', maxHeight: '100%' };
            default: return { width: '75%', maxHeight: '130px' }; // medium
        }
    };

    const handleClick = () => {
        if (isAvailable && onClick) {
            onClick();
        }
    };

    return (
        <div
            className={`card-profile background-${background} ${!isAvailable ? 'no-available' : ''}`}
            onClick={handleClick}
            style={{ cursor: isAvailable ? 'pointer' : 'not-allowed' }}
        >
            <div className="container-eyelash">
                <div className="eyelash-circle"></div>
                <div className="eyelash"></div>
            </div>
            <img src={img} alt={title} style={getLogoSizeStyle()} />
            <strong>{total} Disponibles</strong>
            <span className="available"></span>
        </div>
    );
};

export default CardProfile;