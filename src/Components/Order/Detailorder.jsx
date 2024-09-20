import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

const Detailorder = ({ showModal, handleClose, data }) => {
  return (
    <Dialog
      visible={showModal}
      onHide={handleClose}
      style={{ width: '50vw' }}
      header="Detalles de la Compra"
      footer={
        <div>
        <Button label="Cerrar" icon="pi pi-times" onClick={handleClose} severity='danger' />
      </div>
      }
    >
      {data && (
        <div>
             <div>
            <strong>N° de Compra:</strong> {data.productPurchased?.orderId}
          </div>
          <div>
            <strong>Producto:</strong> {data.nameProduct}
          </div>
          <div>
            <strong>Precio:</strong> ${data.priceProduct}
          </div>
          <div>
            <strong>Fecha de Compra:</strong> {new Date(data.createdAt).toLocaleString()}
          </div>
          <div>
            <strong>Usuario:</strong> {data.user?.username}
          </div>
          <div>
            <strong>Correo:</strong> {data.user?.email}
          </div>
          <div>
            <strong>Saldo restante despues de la compra:</strong> {data.user?.balance}
          </div>
        </div>
      )}
    </Dialog>
  );
};

export default Detailorder;
