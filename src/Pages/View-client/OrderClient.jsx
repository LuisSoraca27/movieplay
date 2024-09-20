import React, { useEffect } from 'react';
import '../../style/orders.css';
import { useSelector, useDispatch } from 'react-redux';
import { getOrdersDayById } from '../../features/orders/OrdersSlice';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';

const OrderClient = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const dispatch = useDispatch();

    if (user.role === 'admin') {
        navigate('/orders');
    }

    const ordersDay = useSelector(state => state.orders.ordersById);

    useEffect(() => {
        dispatch(getOrdersDayById(user.id));
    }, []);

    const handleShow = (order) => {
        // Implementa lógica para mostrar detalles de la orden
        // Puedes usar un modal de PrimeReact o cualquier otro enfoque que prefieras
       
    };

    return (
        <div className='container-orders-father'>
            <h2>Mis Compras</h2>
                <DataTable value={ordersDay} className='p-datatable-sm'>
                    <Column header='Nombre del producto' field='nameProduct'></Column>
                    <Column header='Precio' field='priceProduct'></Column>
                    <Column header='Fecha de compra' field='createdAt' body={(rowData) => {
                        const createdAt = new Date(rowData.createdAt);
                        const dia = createdAt.getDate();
                        const mes = createdAt.toLocaleString('es-ES', { month: 'long' });
                        const anio = createdAt.getFullYear();
                        const hora = createdAt.getHours();
                        const minutos = createdAt.getMinutes();

                        return `${dia} de ${mes} de ${anio}, a las ${hora}:${minutos}`;
                    }}></Column>
                    <Column header='Ver detalles' body={(rowData) => (
                        <Button
                            onClick={() => handleShow(rowData)}
                            label='Ver'
                            icon='pi pi-eye'
                            className='p-button-rounded p-button-info'
                            disabled={true}
                        />
                    )}></Column>
                </DataTable>
        </div>
    );
};

export default OrderClient;
