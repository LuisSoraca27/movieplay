import { useRef } from "react";
import { OverlayPanel } from "primereact/overlaypanel";
import "../style/communitiesPanel.css"; 
import { Button } from "primereact/button";

const CommunitiesPanel = ({ onClose }) => {

  const COMMUNITIES = JSON.parse(import.meta.env.VITE_COMMUNITIES)

  console.log(' Comunidades:', COMMUNITIES);
  const op = useRef(null);

  const handleToggle = (e) => {
    if (op.current) {
      op.current.toggle(e);
    }
  };

  return (
    <div>
      <span className="button-communities" onClick={handleToggle}>
        <span className="button-communities-content">
          <i>Información</i>
          <i
            onClick={onClose}
            className="pi pi-times close-icon"
          ></i>
        </span>
      </span>
      <OverlayPanel ref={op}>
        <div className="communities">
          <h3>Comunidades</h3>
          {COMMUNITIES.map((community, index) => (
            <a
              key={index}
              className="communities-item"
              href={community.url}
              target="_blank"
              rel="noreferrer"
            >
              <i className={`pi pi-${community.icon}`}></i>
              <span>{community.name}</span>
            </a>
          ))}
        </div>
        <a href="https://wa.link/fbpn8d">
        <Button
          label="Recargar"
          icon="pi pi-dollar"
          severity="success"
           style={{margin: '5px', marginBottom: '10px', width: '100%'}}
          />
        </a>
      </OverlayPanel>
    </div>
  );
};

export default CommunitiesPanel;
