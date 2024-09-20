import { Button } from 'primereact/button';
import '../style/CustomNotification.css';

const CustomNotification = ({ notification, onDelete }) => {
    return (
        <div className={`custom-notification `}>
            <div className="message-content">
                <span className="message-text">{notification.message}</span>
                <Button
                    icon="pi pi-times"
                    className="p-button-rounded p-button-danger "
                    onClick={() => onDelete(notification.id)}
                />
            </div>
        </div>
    );
};

export default CustomNotification;
