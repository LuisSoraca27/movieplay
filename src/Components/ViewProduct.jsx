/* eslint-disable react/prop-types */
import  { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Badge } from "primereact/badge";
import { useDispatch } from "react-redux";
import {
  fetchCombosByNameThunk, setComboThunk
} from "../features/user/comboSlice";


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
  const [globalFilter, setGlobalFilter] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); // Estado para el término de búsqueda
  const dispatch = useDispatch();

  const isCombo = (id) => id && id.toLowerCase().startsWith("combo");

  // Efecto para buscar en el backend si es un combo
  useEffect(() => {
    if (isCombo(products[0]?.id) && searchTerm.trim()) {
      dispatch(fetchCombosByNameThunk({ name: searchTerm })); // Busca en el backend si el producto es un combo
    } else {
      // Realiza una búsqueda local en el estado globalFilter si no es combo
      setGlobalFilter(searchTerm);
      dispatch(setComboThunk());
    }
  }, [searchTerm, dispatch]);

  const productTemplate = (product) => {
    return (
      <div className="card-combo card">
        <div className="combo-image-container">
          <img
            src={product.imgCombos[0]?.urlImagen || "/placeholder.jpg"}
            alt={product.name}
            className="product-image"
          />
        </div>
        <div className="product-details">
          <div className="product-stock">
            {product.hasMatchingProfiles ? (
              <Badge severity="success" value="Disponible"></Badge>
            ) : (
              <Badge severity="danger" value="No disponible"></Badge>
            )}
          </div>
          <div className="product-name">{product.name}</div>
          <div className="product-description">{product.description}</div>
          <div className="product-price">
            $
            {new Intl.NumberFormat("co-CO", { currency: "COP" }).format(
              product.price
            )}
          </div>
          <div className="product-button-container">
            <Button
              icon="pi pi-pencil"
              onClick={() => handleEdit(product)}
              className="p-button-secondary"
              text
            />
            <Button
              icon="pi pi-trash"
              onClick={() => handleDelete(product.id)}
              className="p-button-danger"
              text
            />
          </div>
        </div>
      </div>
    );
  };

  const renderProductView = () => {
    // Verificamos si algún producto tiene un ID que comience con 'combo'
    if (products?.length > 0 && isCombo(products[0].id)) {
      return (
        <div className="dataview-demo">
          <div className="card">
            <div className="p-col-6">
              <h5>Todos los combos disponibles</h5>
            </div>
            <div className="container-cards-combos">
              {products.map((product) => (
                <div key={product.id} className="p-col-4 p-md-3 p-lg-2 p-2">
                  {productTemplate(product)}
                </div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // Si no es un "combo", renderizamos el DataTable tradicional.
    return (
      <div
        className="card"
        style={{ width: "100%", margin: "0 auto", padding: "8px 5px" }}
      >
        <DataTable
          value={products}
          globalFilter={globalFilter}
          responsive
        >
          <Column field="name" header="Nombre" />
          <Column field="price" header="Precio" />
          {seeEmail && <Column field="emailAccount" header="Correo" />}
          {seeEmail && <Column field="passwordAccount" header="Contraseña" />}
          {seeEmail && (
            <Column field="durationOfService" header="Días de servicio" />
          )}
          <Column
            field="createdAt"
            header="Fecha de Creación"
            body={(rowData) => {
              const createdAt = new Date(rowData.createdAt);
              return `${createdAt.getDate()} de ${createdAt.toLocaleString(
                "es-ES",
                {
                  month: "long",
                }
              )} de ${createdAt.getFullYear()}, a las ${createdAt.getHours()}:${createdAt.getMinutes()}`;
            }}
          />
          <Column
            header="Acciones"
            body={(rowData) => (
              <div style={{ display: "flex" }}>
                {isEdit && (
                  <Button
                    icon="pi pi-pencil"
                    severity="secondary"
                    rounded
                    text
                    size="small"
                    onClick={() => handleEdit(rowData)}
                  />
                )}
                <Button
                  icon="pi pi-trash"
                  severity="danger"
                  rounded
                  text
                  size="small"
                  onClick={() => handleDelete(rowData.id)}
                />
              </div>
            )}
          />
        </DataTable>
      </div>
    );
  };

  return (
    <>
      <div className="header-products">
        <div className="select-products">
          <InputText
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar productos..."
            style={{ width: "15em", marginRight: "10px" }}
          />
          {seeEmail && (
            <Dropdown
              optionLabel="name"
              value={category}
              options={optionsCategory}
              onChange={(e) => handleCategory(e)}
              placeholder="Selecciona una categoría"
              style={{ width: "15em", marginRight: "10px" }}
            />
          )}
          <Button
            label="Crear Producto"
            onClick={setShow}
            severity="success"
            icon="pi pi-plus"
          />
          {seeEmail && (
            <Button
              label="Subir Excel"
              onClick={() => handleExcel()}
              severity="success"
              icon="pi pi-upload"
              style={{ marginLeft: "10px" }}
            />
          )}
        </div>
      </div>

      {renderProductView()}
    </>
  );
};

export default ViewProduct;
