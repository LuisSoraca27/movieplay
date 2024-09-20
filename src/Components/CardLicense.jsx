import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const CardLicense = ({ license, onClick }) => {
    const header = (
        <img alt="Card" src={license.imgLicenses[0].urlImagen} />
    )

    const footer = (
        <Button label="Comprar" icon="pi pi-shopping-cart" className="p-button-dark" />
    )

    return (
        <Card header={header} footer={footer} title={license.name} subTitle={`$${license.price}`} style={{ width: '17rem', margin: '12px' }} className='card-product' onClick={onClick}>

        </Card>
    );
};

export default CardLicense;
