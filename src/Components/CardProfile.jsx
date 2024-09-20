import React from 'react';
import '../style/cardprofile.css'

const CardProfile = ({ background = 'netflix', img, title, total, onClick }) => {
    return (
        <div className={`card-profile background-${background} ${total === '0' && 'no-available'} `} onClick={onClick}>

            <div className="container-eyelash">
                <div className="eyelash-circle"></div>
                <div className="eyelash"></div>
            </div>
                <img src={img}  width='95%' alt={title} />
                <strong>{total} Disponibles</strong>
                <span className="available"></span>
        </div>
    );
};

export default CardProfile;