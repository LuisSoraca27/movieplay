import React from 'react';
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@heroui/react";
import { AlertTriangle, Check, X } from 'lucide-react';

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title = "Confirmar acción",
    message = "¿Estás seguro de que deseas realizar esta acción?",
    confirmLabel = "Confirmar",
    cancelLabel = "Cancelar",
    confirmColor = "danger",
    isLoading = false
}) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            backdrop="blur"
            classNames={{
                base: "rounded-[2rem] border border-slate-100 shadow-2xl bg-white",
                header: "flex flex-col items-center pb-0 pt-8 px-6",
                body: "py-4 px-8 text-center",
                footer: "pt-6 pb-8 px-8 flex-col sm:flex-row gap-3",
                closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
            }}
        >
            <ModalContent>
                <ModalHeader>
                    <div className="p-4 bg-amber-50 rounded-2xl text-amber-500 border border-amber-100 mb-4 shadow-sm">
                        <AlertTriangle size={32} />
                    </div>
                    <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase">{title}</h2>
                </ModalHeader>
                <ModalBody>
                    <p className="text-slate-500 font-medium leading-relaxed text-sm">{message}</p>
                </ModalBody>
                <ModalFooter>
                    <Button
                        variant="bordered"
                        onPress={onClose}
                        isDisabled={isLoading}
                        className="flex-1 border-slate-200 font-bold text-slate-500 uppercase tracking-widest text-[10px] h-12 rounded-xl hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300"
                    >
                        {cancelLabel}
                    </Button>
                    <Button
                        color={confirmColor}
                        onPress={onConfirm}
                        isLoading={isLoading}
                        className={`flex-1 font-bold uppercase tracking-widest text-[10px] h-12 rounded-xl shadow-lg hover:translate-y-[-2px] transition-transform ${confirmColor === "danger"
                            ? "bg-red-500 hover:bg-red-600 shadow-red-100 text-white"
                            : "bg-slate-900 hover:bg-slate-800 shadow-slate-200 text-white"
                            }`}
                        startContent={!isLoading && <Check size={16} />}
                    >
                        {confirmLabel}
                    </Button>
                </ModalFooter>
            </ModalContent>
        </Modal>
    );
};

export default ConfirmModal;
