import decrypt from "./decrypt";

export default function useViewProductOfOrder(product) {
  if (!product) return null;

  if (product.id.startsWith("profile")) {
    return (
      <div>
        <p style={styles.p}><strong>Nombre: </strong>{product.name}</p>
        <p style={styles.p}><strong>Descripción: </strong>{product.description}</p>
        <p style={styles.p}><strong>Precio: </strong>${product.price}</p>
        <p style={styles.p}><strong>Correo: </strong>{decrypt(product.emailAccount)}</p>
        <p style={styles.p}><strong>Contraseña: </strong>{decrypt(product.passwordAccount)}</p>
        <p style={styles.p}><strong>Perfil: </strong>{product.profileAccount}</p>
        <p style={styles.p}><strong>Pin: </strong>{product.pincodeAccount}</p>
        <p style={styles.p}><strong>Fecha de creación: </strong>{new Date(product.createdAt).toLocaleString()}</p>
      </div>
    );
  } else if (product.id.startsWith("account")) {
    <div>
        <p style={styles.p}><strong>Nombre: </strong>{product.name}</p>
        <p style={styles.p}><strong>Descripción: </strong>{product.description}</p>
        <p style={styles.p}><strong>Precio: </strong>${product.price}</p>
        <p style={styles.p}><strong>Correo: </strong>{decrypt(product.emailAccount)}</p>
        <p style={styles.p}><strong>Contraseña: </strong>{decrypt(product.passwordAccount)}</p>
        <p style={styles.p}><strong>Fecha de creación: </strong>{new Date(product.createdAt).toLocaleString()}</p>
    </div>
  } else if (product.id.startsWith("license") || product.id.startsWith("course")) {
    <div>
        <p style={styles.p}><strong>Nombre: </strong>{product.name}</p>
        <p style={styles.p}><strong>Descripción: </strong>{product.description}</p>
        <p style={styles.p}><strong>Precio: </strong>${product.price}</p>
    </div>
  }
}


const styles = {
    p: {
       margin: '5px 0',
    },
};