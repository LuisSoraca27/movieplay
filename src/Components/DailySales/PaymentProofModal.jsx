import React, { useEffect, useState, useRef } from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Spinner, Checkbox, Image, Button } from "@heroui/react";
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { getReceipt, updateVerificationStatus } from '../../features/DailySale/dailySaleSlice';
import { Check, X } from 'lucide-react';

const PaymentProofModal = ({ visible, onHide, idDailySale, initialVerificationStatus, searchTerm }) => {
    const dispatch = useDispatch();
    const receipt = useSelector(state => state.dailySales.receipt);
    const [loading, setLoading] = useState(true);
    const [isVerified, setIsVerified] = useState(false);
    const requestSentRef = useRef(false);

    useEffect(() => {
        if (visible && idDailySale && !requestSentRef.current) {
            setLoading(true);
            dispatch(getReceipt(idDailySale));
            requestSentRef.current = true;
        }

        if (!visible) {
            requestSentRef.current = false;
        }
    }, [visible, idDailySale]);

    useEffect(() => {
        if (initialVerificationStatus !== undefined) {
            setIsVerified(initialVerificationStatus);
        }
    }, [initialVerificationStatus]);

    const handleImageLoad = () => {
        setLoading(false);
    };

    const handleVerificationChange = async (checked) => {
        setIsVerified(checked);
        try {
            dispatch(updateVerificationStatus(idDailySale, checked, searchTerm.toISOString()))
        } catch (error) {
            console.error('Error al actualizar el estado de verificación:', error);
            setIsVerified(!checked);
        }
    };

    return (
        <Modal
            isOpen={visible}
            onClose={onHide}
            size="2xl"
            backdrop="blur"
            scrollBehavior="inside"
            classNames={{
                base: "rounded-[2rem] border border-slate-100 shadow-2xl safe-area-y bg-white",
                header: "border-b border-slate-100 py-4 px-6",
                body: "p-0",
                footer: "border-t border-slate-100 py-4 px-6",
                closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4 z-50 bg-white/50 backdrop-blur-md"
            }}
        >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-slate-800">Comprobante de Pago</h2>
                    <span className="text-sm font-medium text-slate-500">Verifica el comprobante adjunto a esta venta</span>
                </ModalHeader>
                <ModalBody className="min-h-[300px] flex items-center justify-center bg-slate-50">
                    {loading && (
                        <div className="flex flex-col items-center gap-4">
                            <Spinner size="lg" color="default" />
                            <p className="text-slate-400 font-medium text-sm animate-pulse">Cargando imagen...</p>
                        </div>
                    )}

                    {receipt ? (
                        <div className="relative w-full h-full min-h-[400px] flex items-center justify-center p-4">
                            <img
                                src={receipt}
                                alt="Comprobante de Pago"
                                className="max-w-full max-h-[70vh] rounded-xl shadow-lg object-contain transition-opacity duration-300"
                                style={{ opacity: loading ? 0 : 1 }}
                                onLoad={handleImageLoad}
                            />
                        </div>
                    ) : (
                        !loading && (
                            <div className="flex flex-col items-center gap-2 text-slate-400">
                                <X size={48} strokeWidth={1.5} />
                                <p className="font-medium">No se encontró el comprobante</p>
                            </div>
                        )
                    )}
                </ModalBody>
                <ModalFooter className="flex justify-between items-center bg-white">
                    <div className="flex-1">
                        <Checkbox
                            isSelected={isVerified}
                            onValueChange={handleVerificationChange}
                            color="success"
                            classNames={{
                                label: "text-slate-600 font-semibold text-sm",
                                wrapper: "before:border-slate-300",
                            }}
                        >
                            Verificar como válido
                        </Checkbox>
                    </div>

                    <Button
                        variant="bordered"
                        onPress={onHide}
                        className="border-slate-200 font-semibold text-slate-700 uppercase tracking-widest text-xs"
                    >
                        Cerrar
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
}

PaymentProofModal.propTypes = {
    visible: PropTypes.bool.isRequired,
    onHide: PropTypes.func.isRequired,
    idDailySale: PropTypes.string,
    initialVerificationStatus: PropTypes.bool
};

export default PaymentProofModal;