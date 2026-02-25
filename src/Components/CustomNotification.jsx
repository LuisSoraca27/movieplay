// Removed: import '../style/CustomNotification.css';
import { Button, Card, CardBody, Avatar } from "@heroui/react";
import { X, Bell, Clock } from 'lucide-react';

const CustomNotification = ({ notification, onDelete }) => {
    return (
        <Card className="w-full border-none shadow-sm hover:shadow-md transition-all duration-200">
            <CardBody className="p-3 flex flex-row gap-3 items-start">
                <Avatar
                    icon={<Bell size={18} />}
                    className="flex-shrink-0 bg-primary/10 text-primary"
                    size="sm"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                        <span className="text-xs text-default-400 flex items-center gap-1">
                            <Clock size={10} />
                            {new Date(notification.createdAt || Date.now()).toLocaleDateString('es-CO', {
                                day: '2-digit', month: '2-digit', year: 'numeric',
                                hour: '2-digit', minute: '2-digit'
                            })}
                        </span>
                        <Button
                            isIconOnly
                            variant="light"
                            color="danger"
                            size="sm"
                            onPress={() => onDelete(notification.id)}
                            className="h-6 w-6 min-w-4"
                            radius="full"
                        >
                            <X size={14} />
                        </Button>
                    </div>
                    <p className="text-default-600 text-sm leading-snug">
                        {notification.message}
                    </p>
                </div>
            </CardBody>
        </Card>
    );
};

export default CustomNotification;
