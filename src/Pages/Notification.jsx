import { useEffect, useState } from 'react';
import { Card, CardHeader, CardBody, Button, Textarea, Chip, ScrollShadow, useDisclosure } from "@heroui/react";
import { addToast } from "@heroui/toast";
import { useDispatch, useSelector } from 'react-redux';
import { getNotificationThunk, deleteNotificationThunk, createNotificationThunk } from '../features/notifications/notificationSlice';
import PopupNotification from '../Components/Notifications/PopupNotification';
import ConfirmModal from '../Components/ui/ConfirmModal';
import { Bell, Send, Eye, Inbox, Trash2 } from 'lucide-react';
import socket from '../api/socket';

const Notification = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);
    const [notification, setNotification] = useState('');
    const [visible, setVisible] = useState(false);

    // Delete Confirmation State
    const [deleteId, setDeleteId] = useState(null);
    const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();

    const user = JSON.parse(localStorage.getItem('user'));

    const sendNotification = (data) => {
        socket.emit('sendNotification', {
            title: 'Nueva notificación',
            message: data,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendNotification(notification);
        dispatch(createNotificationThunk({ message: notification }));
        setNotification('');
        addToast({ title: "Éxito", description: "Notificación enviada", color: "success" });
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        onConfirmOpen();
    };

    const handleDelete = () => {
        if (deleteId) {
            dispatch(deleteNotificationThunk(deleteId));
            addToast({ title: "Info", description: "Notificación eliminada", color: "primary" });
            onConfirmOpenChange(false);
            setDeleteId(null);
        }
    };

    useEffect(() => {
        dispatch(getNotificationThunk())
            .catch((error) => {
                console.error('Error al obtener notificaciones:', error);
            });
    }, [dispatch]);

    return (
        <div className="animate-fade-in relative overflow-hidden pt-8 pb-12 w-full min-h-full">
            {/* Fondo con Blobs sutiles */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-indigo-100/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-6 space-y-10">
                <PopupNotification visible={visible} setVisible={setVisible} />
                <ConfirmModal
                    isOpen={isConfirmOpen}
                    onClose={() => onConfirmOpenChange(false)}
                    onConfirm={handleDelete}
                    title="Eliminar Notificación"
                    message="¿Estás seguro de que deseas eliminar este anuncio? Esta acción no se puede deshacer."
                    confirmColor="danger"
                />

                {/* Header Hybrid Premium */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div className="flex items-center gap-5">
                        <div className="p-5 bg-white shadow-lg rounded-2xl text-slate-800 border border-slate-100">
                            <Bell size={32} />
                        </div>
                        <div>
                            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                                Centro de Comunicados
                            </h1>
                            <p className="text-slate-500 text-[11px] font-bold uppercase tracking-wider mt-1">
                                Gestión de anuncios del sistema para todos los usuarios
                            </p>
                        </div>
                    </div>
                    <Button
                        variant="flat"
                        color="default"
                        startContent={<Eye size={20} />}
                        onPress={() => setVisible(true)}
                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 px-8 rounded-xl shadow-md hover:bg-slate-800 hover:scale-105 transition-all"
                    >
                        Gestionar Popup
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                    {/* Composer Card Premium */}
                    <Card className="lg:col-span-12 xl:col-span-4 h-fit bg-white border border-slate-200 rounded-[2rem] p-4 shadow-sm">
                        <CardHeader className="pb-0 pt-4 px-4 flex-col items-start gap-1">
                            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Crear Anuncio</h2>
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Notificación Global</p>
                        </CardHeader>
                        <CardBody className="py-6">
                            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                                <Textarea
                                    value={notification}
                                    onChange={(e) => setNotification(e.target.value)}
                                    minRows={6}
                                    label="MENSAJE DEL COMUNICADO"
                                    labelPlacement="outside"
                                    placeholder="Escribe aquí el contenido de la notificación..."
                                    variant="underlined"
                                    classNames={{
                                        label: "text-slate-400 font-bold tracking-wider text-[10px]",
                                        input: "text-slate-800 font-semibold text-lg py-2",
                                        inputWrapper: "border-slate-200"
                                    }}
                                />
                                <Button
                                    type="submit"
                                    isDisabled={!notification.trim()}
                                    className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-14 rounded-xl shadow-md hover:bg-slate-800 hover:scale-[1.02] active:scale-95 transition-all w-full"
                                    endContent={<Send size={18} />}
                                >
                                    Enviar Notificación
                                </Button>
                            </form>
                        </CardBody>
                    </Card>

                    {/* Feed Section Premium */}
                    <div className="lg:col-span-12 xl:col-span-8 flex flex-col gap-6">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-3">
                                <Inbox size={24} className="text-slate-400" />
                                <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">Historial de Envíos</h2>
                            </div>
                            <Chip
                                size="sm"
                                variant="flat"
                                className="bg-blue-50 text-blue-600 font-bold uppercase tracking-widest text-[9px] px-3 py-1 rounded-full border border-blue-100"
                                startContent={<Bell size={10} />}
                            >
                                {notifications.length} ACTIVAS
                            </Chip>
                        </div>

                        <ScrollShadow className="h-[calc(100vh-350px)] xl:h-[calc(100vh-280px)] w-full pr-4 pb-12 custom-scrollbar">
                            <div className="space-y-4">
                                {notifications.length === 0 ? (
                                    <div className="py-24 flex flex-col items-center text-center gap-4 bg-slate-50/50 rounded-[2rem] border border-dashed border-slate-200">
                                        <Inbox size={48} className="text-slate-200" />
                                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No hay notificaciones activas</p>
                                    </div>
                                ) : (
                                    notifications.map((notif, index) => (
                                        <Card
                                            key={index}
                                            className="w-full bg-white border border-slate-100 rounded-[2rem] p-2 shadow-sm hover:shadow-md hover:border-slate-200 transition-all group"
                                        >
                                            <CardBody className="p-4 flex flex-row gap-5 items-start">
                                                <div className="mt-1 p-3 bg-slate-50 rounded-2xl text-slate-400 group-hover:text-blue-500 transition-colors">
                                                    <Bell size={20} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-slate-800 text-lg font-semibold leading-relaxed whitespace-pre-wrap">
                                                        {notif.message || notif.contenido}
                                                    </p>
                                                    <div className="flex items-center gap-2 mt-3">
                                                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-50 px-3 py-1 rounded-full">
                                                            {new Date(notif.createdAt || Date.now()).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                                <Button
                                                    isIconOnly
                                                    size="sm"
                                                    variant="light"
                                                    color="danger"
                                                    className="opacity-0 group-hover:opacity-100 rounded-xl hover:bg-red-50 transition-all"
                                                    onPress={() => confirmDelete(notif.id)}
                                                >
                                                    <Trash2 size={18} />
                                                </Button>
                                            </CardBody>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </ScrollShadow>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notification;
