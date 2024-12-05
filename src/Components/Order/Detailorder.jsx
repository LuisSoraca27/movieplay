/* eslint-disable react/prop-types */
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";;
import { jsPDF } from "jspdf";
import decrypt from "../../Helpers/decrypt";

const Detailorder = ({ showModal, handleClose, data }) => {
  const productDetails = data?.productDetails;

  const styles = {
    container: {
      padding: "1rem",
      fontFamily: "'Roboto', sans-serif",
      lineHeight: "1.5",
    },
    title: {
      fontSize: "1.25rem",
      fontWeight: "bold",
      marginBottom: "1rem",
      color: "#333",
    },
    label: {
      fontWeight: "bold",
      marginRight: "0.5rem",
    },
    value: {
      color: "#555",
    },
    divider: {
      margin: "1rem 0",
      borderBottom: "1px solid #ddd",
    },
    footer: {
      display: "flex",
      justifyContent: "space-between",
    },
  };

  const renderDetails = () => {
    if (productDetails && productDetails.id?.startsWith("profile")) {
      return (
        <div>
          <b>PERFIL ENTREGADO</b>
          <p>
            <span style={styles.label}>Nombre:</span>
            <span style={styles.value}>{productDetails.name}</span>
          </p>
          <p>
            <span style={styles.label}>Descripción:</span>
            <span style={styles.value}>{productDetails.description}</span>
          </p>
          <p>
            <span style={styles.label}>Precio:</span>
            <span style={styles.value}>${productDetails.price}</span>
          </p>
          <p>
            <span style={styles.label}>Correo:</span>
            <span style={styles.value}>
              {decrypt(productDetails.emailAccount)}
            </span>
          </p>
          <p>
            <span style={styles.label}>Contraseña:</span>
            <span style={styles.value}>
              {decrypt(productDetails.passwordAccount)}
            </span>
          </p>
          <p>
            <span style={styles.label}>Perfil:</span>
            <span style={styles.value}>{productDetails.profileAccount}</span>
          </p>
          <p>
            <span style={styles.label}>Pin:</span>
            <span style={styles.value}>{productDetails.pincodeAccount}</span>
          </p>
          <p>
            <span style={styles.label}>Fecha de creación:</span>
            <span style={styles.value}>
              {new Date(productDetails.createdAt).toLocaleString()}
            </span>
          </p>
        </div>
      );
    } else if (productDetails && productDetails.id?.startsWith("account")) {
      return (
        <div>
          <p>
            <span style={styles.label}>Nombre:</span>
            <span style={styles.value}>{productDetails.name}</span>
          </p>
          <p>
            <span style={styles.label}>Descripción:</span>
            <span style={styles.value}>{productDetails.description}</span>
          </p>
          <p>
            <span style={styles.label}>Precio:</span>
            <span style={styles.value}>${productDetails.price}</span>
          </p>
          <p>
            <span style={styles.label}>Correo:</span>
            <span style={styles.value}>
              {decrypt(productDetails.emailAccount)}
            </span>
          </p>
          <p>
            <span style={styles.label}>Contraseña:</span>
            <span style={styles.value}>
              {decrypt(productDetails.passwordAccount)}
            </span>
          </p>
          <p>
            <span style={styles.label}>Fecha de creación:</span>
            <span style={styles.value}>
              {new Date(productDetails.createdAt).toLocaleString()}
            </span>
          </p>
        </div>
      );
    } else if (
      productDetails &&
      productDetails?.combo?.id?.startsWith("combo")
    ) {
      const { profiles, accounts } = productDetails;

      return (
        <div>
          <b>COMBO ENTREGADO</b>
          {profiles && (
            <div>
              <b>Perfiles:</b>
              {profiles.map((profile, index) => (
                <div key={`profile-${index}`} style={{ marginBottom: "1rem" }}>
                  <p>
                    <span style={styles.label}>Nombre:</span>
                    <span style={styles.value}>{profile.name}</span>
                  </p>
                  <p>
                    <span style={styles.label}>Descripción:</span>
                    <span style={styles.value}>{profile.description}</span>
                  </p>
                  <p>
                    <span style={styles.label}>Precio:</span>
                    <span style={styles.value}>${profile.price}</span>
                  </p>
                  <p>
                    <span style={styles.label}>Correo:</span>
                    <span style={styles.value}>
                      {decrypt(profile.emailAccount)}
                    </span>
                  </p>
                  <p>
                    <span style={styles.label}>Contraseña:</span>
                    <span style={styles.value}>
                      {decrypt(profile.passwordAccount)}
                    </span>
                  </p>
                  <hr />
                </div>
              ))}
            </div>
          )}
          {accounts && (
            <div>
              <b>Cuentas:</b>
              {accounts.map((account, index) => (
                <div key={`account-${index}`} style={{ marginBottom: "1rem" }}>
                  <p>
                    <span style={styles.label}>Nombre:</span>
                    <span style={styles.value}>{account.name}</span>
                  </p>
                  <p>
                    <span style={styles.label}>Descripción:</span>
                    <span style={styles.value}>{account.description}</span>
                  </p>
                  <p>
                    <span style={styles.label}>Precio:</span>
                    <span style={styles.value}>${account.price}</span>
                  </p>
                  <p>
                    <span style={styles.label}>Correo:</span>
                    <span style={styles.value}>
                      {decrypt(account.emailAccount)}
                    </span>
                  </p>
                  <p>
                    <span style={styles.label}>Contraseña:</span>
                    <span style={styles.value}>
                      {decrypt(account.passwordAccount)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      );
    }
  };

  const handleDownloadInvoice = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Compra", 20, 20);
    doc.setFontSize(12);

    doc.text(`N° de Compra: ${data.id}`, 20, 40);
    doc.text(`Producto: ${data.nameProduct}`, 20, 50);
    doc.text(`Precio: $${data.priceProduct}`, 20, 60);
    doc.text(
      `Fecha de Compra: ${new Date(data.createdAt).toLocaleString()}`,
      20,
      70
    );
    doc.text(`Usuario: ${data.username}`, 20, 80);

    if (productDetails) {
      doc.text("Detalles del Producto:", 20, 100);

      if (productDetails.combo?.id.startsWith("combo")) {
        let yPosition = 110;

        const { profiles, accounts } = productDetails;

        profiles && doc.text("Perfiles:", 20, yPosition);
        yPosition += 10;
        profiles.forEach((profile) => {
          doc.text(`Nombre: ${profile.name}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Precio: ${profile.price}`, 20, yPosition);
          yPosition += 10;
        });

        accounts && doc.text("Cuentas:", 20, yPosition);
        yPosition += 10;
        accounts.forEach((account) => {
          doc.text(`Nombre: ${account.name}`, 20, yPosition);
          yPosition += 10;
          doc.text(`Precio: ${account.price}`, 20, yPosition);
        });
      }
    }

    doc.save(`factura_${data.id}.pdf`);
  };

  return (
    <Dialog
      visible={showModal}
      onHide={handleClose}
      style={{ width: "400px" }}
      header="Detalles de la Compra"
      footer={
        <div style={styles.footer}>
          <Button
            label="Descargar Reporte"
            icon="pi pi-download"
            onClick={handleDownloadInvoice}
            severity="success"
          />
          <Button
            label="Cerrar"
            icon="pi pi-times"
            onClick={handleClose}
            severity="danger"
          />
        </div>
      }
    >
      <div style={styles.container}>
        <p>
          <span style={styles.label}>N° de Compra:</span>
          <span style={styles.value}>{data?.id}</span>
        </p>
        <p>
          <span style={styles.label}>Producto:</span>
          <span style={styles.value}>{data?.nameProduct}</span>
        </p>
        <p>
          <span style={styles.label}>Precio:</span>
          <span style={styles.value}>${data?.priceProduct}</span>
        </p>
        <p>
          <span style={styles.label}>Fecha de Compra:</span>
          <span style={styles.value}>
            {new Date(data?.createdAt).toLocaleString()}
          </span>
        </p>
        <p>
          <span style={styles.label}>Usuario:</span>
          <span style={styles.value}>{data?.username}</span>
        </p>
        <div style={styles.divider}></div>
        {renderDetails()}
      </div>
    </Dialog>
  );
};

export default Detailorder;
