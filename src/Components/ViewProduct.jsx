import React from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import '../style/products.css';

const ViewProduct = ({
    products,
    optionsCategory,
    handleCategory,
    category,
    handleDelete,
    setShow,
    handleEdit,
    isEdit,
    seeEmail,
    handleExcel,
}) => {
    return (
        <>
            <div className="header-products">
                <div className="select-products">
                    {category === undefined ? (
                        <p style={{ marginTop: '-10px' }}></p>
                    ) : (
                        <Dropdown
                            optionLabel="name"
                            value={category}
                            options={optionsCategory}
                            onChange={(e) => handleCategory(e)}
                            placeholder="Selecciona una categoría"
                            style={{ width: '15em', marginRight: '10px' }}
                        />
                    )}
                    <Button
                        label="Crear Producto"
                        onClick={setShow}
                        severity="success"
                        icon="pi pi-plus"
                    />
                    {
                        seeEmail && <Button
                            label="Subir Excel"
                            onClick={() => handleExcel()}
                            severity="success"
                            icon="pi pi-upload"
                            style={{ marginLeft: '10px' }}
                        />
                    }
                </div>
            </div>
            <DataTable value={products}  size="small">
                <Column field="name" header="Nombre" />
                <Column field="description" header="Descripción" />
                <Column field="price" header="Precio" />
                {seeEmail && <Column field="emailAccount" header="Correo" />}
                {seeEmail && <Column field="passwordAccount" header="Contraseña" />}
                {seeEmail && <Column field="durationOfService" header="Dias de servicio" />}
                <Column
                    field="createdAt"
                    header="Fecha de Creacion"
                    body={(rowData) => {
                        const createdAt = new Date(rowData.createdAt);
                        return `${createdAt.getDate()} de ${createdAt.toLocaleString('es-ES', {
                            month: 'long'
                        })} de ${createdAt.getFullYear()}, a las ${createdAt.getHours()}:${createdAt.getMinutes()}`;
                    }}
                />
                <Column
                    header="Acciones"
                    body={(rowData) => (
                        <div className="p-d-flex p-flex-column p-jc-start p-ai-center">
                            {isEdit && (
                                <Button
                                    label="Editar"
                                    severity="primary"
                                    rounded
                                    size="small"
                                    onClick={() => handleEdit(rowData)}
                                    className="p-mb-1"
                                    style={{ margin: '3px' }}
                                />
                            )}
                            <Button
                                label="Borrar"
                                severity="danger"
                                rounded
                                size="small"
                                onClick={() => handleDelete(rowData.id)}
                                className="p-mb-1"
                                style={{ margin: '3px' }}
                            />
                        </div>
                    )}
                />
            </DataTable>
        </>
    );
};

export default ViewProduct;
