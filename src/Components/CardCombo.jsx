import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import '../style/cardcombos.css';

// eslint-disable-next-line react/prop-types
const CardCombo = ({ combo, onClick }) => {
    const header = (
        // eslint-disable-next-line react/prop-types
        <img alt="Card" src={combo.imgCombos[0].urlImagen} />
    )
    const footer = (
        <Button label="Comprar" icon="pi pi-shopping-cart" className="p-button-dark" />
    )
    return (
        <Card title={combo.name}
         subTitle={`$${combo.price}`}
          style={{ width: '17rem', 
          margin: '12px' }} 
          className='card-combos' 
          onClick={onClick}
          footer={footer}
          header={header}
          >
        </Card>
    );
};

export default CardCombo;
