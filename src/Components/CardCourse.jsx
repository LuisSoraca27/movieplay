import React from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';

const CardCourse = ({ course, onClick }) => {
    const header = (
        <img alt="Card" src={course.imgCourses[0].urlImagen} />
    )

    const footer = (
        <Button label="Comprar"  icon="pi pi-shopping-cart" className="p-button-dark" />
    )

    return (
        <Card header={header} footer={footer} title={course.name} subTitle={`$${course.price}`} style={{ width: '17rem', margin: '12px' }} className='card-combos' onClick={onClick}>
        </Card>
    );
};

export default CardCourse;
