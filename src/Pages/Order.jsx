import { useEffect, useState } from 'react';
import '../style/orders.css';
import { useSelector, useDispatch } from 'react-redux';
import { getOrdersDay, getOrdersMonth } from '../features/orders/OrdersSlice';
import { DataTable } from 'primereact/datatable';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import Detailorder from '../Components/Order/Detailorder';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { downloadSales } from '../features/orders/OrdersSlice';
        

const Order = () => {


  const [date, setDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => setShowModal(false);
  const [showModalExcel, setShowModalExcel] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShow = (data) => {
    setData(data);
    setShowModal(true);
  };

  const dispatch = useDispatch();
  const { ordersDay, ordersMonth } = useSelector((state) => state.orders);
  const orders = ordersDay.map((order) => order.priceProduct);
  const total = orders.reduce((a, b) => a + b, 0);

  const createdAtTemplate = (rowData) => {
    const createdAt = new Date(rowData.createdAt);
    const dia = createdAt.getDate();
    const mes = createdAt.toLocaleString('es-ES', { month: 'long' });
    const anio = createdAt.getFullYear();
    const hora = createdAt.getHours();
    const minutos = createdAt.getMinutes();
    return `${dia} de ${mes} de ${anio}, a las ${hora}:${minutos}`;
  };

  const modaldownloadExcel = () => {

    return (
      <>
        <Button
          label="Descargar ventas"
          icon="pi pi-download"
          onClick={() => setShowModalExcel(true)}
        />
        <br />
        <br />
        <Dialog header="Descargar ventas" visible={showModalExcel} onHide={() => setShowModalExcel(false)}
          style={{ width: '370px' }} 
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <p style={{ fontWeight: 'bold' }}>¿Para qué fecha te gustaría obtener los registros de ventas?</p>
            <Calendar value={date} onChange={(e) => setDate(e.value)} placeholder='Seleccione una fecha'
              dateFormat="dd/mm/yy" showIcon disabled={loading}
            />
            <hr />
            <Button label="Descargar" icon="pi pi-download" 
              onClick={handleDownloadExcel} loading={loading} disabled={loading}
            />
          </div>
        </Dialog>

      </>
    )
  }

  const handleDownloadExcel = () => {
    setLoading(true)
    dispatch(downloadSales(date))
    .then(() => {
      setShowModalExcel(false)
      setLoading(false)
      ;})
  }
  
  useEffect(() => {
    dispatch(getOrdersDay());
    dispatch(getOrdersMonth());
  }, [dispatch]);

  return (
    <>
      <Detailorder showModal={showModal} handleClose={handleClose} data={data} />
      <div className="container-orders-father">
        <h2>Ventas</h2>
        <div className="container-orders">
          <div className="info-orders">
            <h3>${total}</h3>
            <h2>Ventas del día de hoy </h2>
          </div>
          <div className="info-orders">
            <h3>${ordersMonth}</h3>
            <h2>Total ventas del mes </h2>
          </div>
        </div>
        <div style={{ marginTop: '50px' }}>
        {modaldownloadExcel()}
          <DataTable value={ordersDay} className="p-datatable-striped" responsiveLayout="scroll" stripedRows 
          paginator rows={10} rowsPerPageOptions={[20,30, 50, 100]} size='small'
          >
            <Column field="nameProduct" header="Nombre del producto" />
            <Column field="username" header="Comprador" />
            <Column field="priceProduct" header="Precio" />
            <Column field="createdAt" header="Fecha de Compra" body={createdAtTemplate} />
            <Column body={(rowData) => <Button disabled label="Ver detalles" onClick={() => handleShow(rowData)} className="p-button-rounded p-button-info" />} />
          </DataTable>
        </div>
      </div>
    </>
  );
};

export default Order;
