import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Badge,
    Button,
    ScrollShadow,
    Spinner,
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
} from '@heroui/react';
import { Bell, Check, CheckCheck, X, Trash2 } from 'lucide-react';
import {
    getNotificationThunk,
    markAsReadThunk,
    markAllAsReadThunk
} from '../../features/notifications/notificationSlice';

// Helper hook for responsive design
const useMediaQuery = (query) => {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const media = window.matchMedia(query);
        if (media.matches !== matches) {
            setMatches(media.matches);
        }
        const listener = () => setMatches(media.matches);
        media.addEventListener('change', listener);
        return () => media.removeEventListener('change', listener);
    }, [matches, query]);

    return matches;
};

const NotificationList = ({ notifications, onMarkAsRead, formatDate }) => {
    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
                <div className="p-4 rounded-full bg-zinc-800/50 mb-4 border border-zinc-700/50">
                    <Bell size={32} className="text-zinc-500" />
                </div>
                <p className="text-zinc-300 font-semibold mb-1">Sin notificaciones</p>
                <p className="text-zinc-500 text-xs max-w-[200px]">
                    Te avisaremos cuando haya actualizaciones importantes.
                </p>
            </div>
        );
    }

    return (
        <ScrollShadow className="max-h-[70vh] md:max-h-96 overflow-y-auto w-full">
            <div className="divide-y divide-zinc-800/50">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`group px-5 py-4 hover:bg-zinc-800/30 transition-all duration-300 flex gap-4 ${!notif.read ? 'bg-blue-500/[0.03] border-l-2 border-blue-500' : 'border-l-2 border-transparent'
                            }`}
                    >
                        {/* Status Icon */}
                        <div className="flex-shrink-0 pt-1">
                            {!notif.read ? (
                                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)] ring-2 ring-blue-500/20" />
                            ) : (
                                <div className="w-2.5 h-2.5 rounded-full bg-zinc-700/50" />
                            )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0 space-y-1.5">
                            <p className={`text-sm leading-relaxed font-medium ${!notif.read ? 'text-zinc-100' : 'text-zinc-400'
                                }`}>
                                {notif.message}
                            </p>
                            <span className="text-[10px] uppercase tracking-wider font-bold text-zinc-600 flex items-center gap-1.5">
                                {formatDate(notif.createdAt)}
                            </span>
                        </div>

                        {/* Actions */}
                        {!notif.read && (
                            <div className="flex-shrink-0 self-start opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button
                                    isIconOnly
                                    size="sm"
                                    variant="light"
                                    onClick={(e) => onMarkAsRead(notif.id, e)}
                                    className="text-zinc-500 hover:text-blue-400 min-w-8 w-8 h-8 rounded-full"
                                    title="Marcar como leída"
                                >
                                    <Check size={16} strokeWidth={2.5} />
                                </Button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </ScrollShadow>
    );
};

const NotificationDropdown = () => {
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const dropdownRef = useRef(null);
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Filter unread notifications
    const unreadNotifications = notifications.filter(n => !n.read);
    const unreadCount = unreadNotifications.length;

    // Fetch notifications on mount
    useEffect(() => {
        dispatch(getNotificationThunk());
    }, [dispatch]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen && !isMobile) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, isMobile]);

    // Handle scroll lock for mobile drawer
    useEffect(() => {
        if (isMobile && isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => { document.body.style.overflow = 'unset'; };
    }, [isMobile, isOpen]);

    const handleMarkAsRead = async (id, e) => {
        if (e) e.stopPropagation();
        await dispatch(markAsReadThunk(id));
    };

    const handleMarkAllAsRead = async () => {
        setIsLoading(true);
        await dispatch(markAllAsReadThunk());
        setIsLoading(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'Ahora';
        if (diffMins < 60) return `Hace ${diffMins}m`;
        if (diffHours < 24) return `Hace ${diffHours}h`;
        if (diffDays < 7) return `Hace ${diffDays}d`;
        return date.toLocaleDateString();
    };

    // Shared Header Component
    const NotificationHeader = () => (
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800/50 bg-zinc-900/50 backdrop-blur-xl">
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Bell size={20} className="text-white" />
                    {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-zinc-900 animate-pulse" />
                    )}
                </div>
                <div>
                    <h3 className="font-bold text-white text-base tracking-tight">Notificaciones</h3>
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                        {unreadCount > 0 ? `${unreadCount} Nuevas` : 'Bandeja al día'}
                    </p>
                </div>
            </div>
            {unreadCount > 0 && (
                <Button
                    size="sm"
                    variant="flat"
                    color="primary"
                    isLoading={isLoading}
                    onPress={handleMarkAllAsRead}
                    className="h-8 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 font-bold text-[10px] uppercase tracking-wider px-3 rounded-lg"
                    startContent={!isLoading && <CheckCheck size={14} />}
                >
                    Leer todo
                </Button>
            )}
        </div>
    );

    return (
        <>
            {isMobile ? (
                // Mobile Implementation: Drawer
                <>
                    <Badge
                        content={unreadCount > 99 ? '99+' : unreadCount}
                        color="danger"
                        size="sm"
                        isInvisible={unreadCount === 0}
                        shape="circle"
                        className="border-none shadow-lg"
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => setIsOpen(true)}
                            className="text-zinc-400 hover:text-white data-[hover=true]:bg-white/5 rounded-full w-10 h-10"
                        >
                            <Bell size={20} />
                        </Button>
                    </Badge>

                    <Drawer
                        isOpen={isOpen}
                        onClose={() => setIsOpen(false)}
                        placement="bottom"
                        classNames={{
                            base: "bg-zinc-950 border-t border-zinc-800 rounded-t-[2rem] max-h-[85vh]",
                            header: "p-0 border-b border-zinc-800/50",
                            body: "p-0",
                            closeButton: "top-4 right-4 text-zinc-400 hover:text-white bg-zinc-800/50 rounded-full p-2 z-50",
                        }}
                    >
                        <DrawerContent>
                            <DrawerHeader className="flex flex-col gap-1">
                                <NotificationHeader />
                            </DrawerHeader>
                            <DrawerBody>
                                <NotificationList
                                    notifications={notifications}
                                    onMarkAsRead={handleMarkAsRead}
                                    formatDate={formatDate}
                                />
                            </DrawerBody>
                        </DrawerContent>
                    </Drawer>
                </>
            ) : (
                // Desktop Implementation: Manual Dropdown (Restored Original Icon Structure)
                <div className="relative" ref={dropdownRef}>
                    <Badge
                        content={unreadCount > 99 ? '99+' : unreadCount}
                        color="danger"
                        size="sm"
                        isInvisible={unreadCount === 0}
                        shape="circle"
                        className="border-2 border-zinc-950 shadow-sm translate-x-1 -translate-y-1"
                    >
                        <Button
                            isIconOnly
                            variant="light"
                            onPress={() => setIsOpen(!isOpen)}
                            className={`text-white hover:bg-white/10 rounded-full w-10 h-10 transition-all active:scale-95 ${isOpen ? 'bg-white/10' : ''}`}
                        >
                            <Bell size={20} />
                        </Button>
                    </Badge>

                    {isOpen && (
                        <div className="absolute right-0 top-12 w-[400px] bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden backdrop-blur-3xl ring-1 ring-white/5 animate-in fade-in slide-in-from-top-2 duration-200 z-50">
                            <NotificationHeader />
                            <NotificationList
                                notifications={notifications}
                                onMarkAsRead={handleMarkAsRead}
                                formatDate={formatDate}
                            />
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default NotificationDropdown;
