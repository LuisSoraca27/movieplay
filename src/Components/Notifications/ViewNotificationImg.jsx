import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { useSelector, useDispatch } from 'react-redux';
import { getNotificationImgThunk, setViewNotification } from '../../features/notifications/notificationSlice';
import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ViewNotificationImg = () => {
    const dispatch = useDispatch();
    const user = JSON.parse(localStorage.getItem('user')) || {};
    const { ViewNotification, notificationImg } = useSelector((state) => state.notification);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleShow = () => {
        return notificationImg.length !== 0 && !ViewNotification;
    };

    useEffect(() => {
        if (user?.role && user.role !== 'admin' && !ViewNotification) {
            dispatch(getNotificationImgThunk());
        }
    }, [dispatch, ViewNotification, user?.role]);

    // Auto-advance carousel
    useEffect(() => {
        if (handleShow() && notificationImg.length > 1) {
            const interval = setInterval(() => {
                setCurrentIndex((prev) => (prev + 1) % notificationImg.length);
            }, 2000);
            return () => clearInterval(interval);
        }
    }, [notificationImg.length, ViewNotification]);

    const handlePrev = () => {
        setCurrentIndex((prev) => (prev - 1 + notificationImg.length) % notificationImg.length);
    };

    const handleNext = () => {
        setCurrentIndex((prev) => (prev + 1) % notificationImg.length);
    };

    return (
        <Modal
            isOpen={handleShow()}
            onClose={() => dispatch(setViewNotification(true))}
            size="lg"
            classNames={{
                base: "bg-transparent shadow-none",
                body: "p-0"
            }}
        >
            <ModalContent>
                <ModalBody>
                    {notificationImg.length > 0 && (
                        <div className="relative">
                            <a
                                target="_blank"
                                href={notificationImg[currentIndex]?.linkImg || '#'}
                                rel="noreferrer"
                            >
                                <img
                                    src={notificationImg[currentIndex]?.urlImagen}
                                    className="w-full max-h-[80vh] object-contain rounded-lg"
                                    alt="Notificación"
                                />
                            </a>

                            {notificationImg.length > 1 && (
                                <>
                                    <button
                                        onClick={handlePrev}
                                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                                    >
                                        <ChevronLeft size={24} />
                                    </button>
                                    <button
                                        onClick={handleNext}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition"
                                    >
                                        <ChevronRight size={24} />
                                    </button>

                                    {/* Dots indicator */}
                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                        {notificationImg.map((_, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setCurrentIndex(index)}
                                                className={`w-2 h-2 rounded-full transition ${index === currentIndex ? 'bg-white' : 'bg-white/50'
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </ModalBody>
            </ModalContent>
        </Modal>
    );
};

export default ViewNotificationImg;
