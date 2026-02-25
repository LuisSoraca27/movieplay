import { useState, useEffect } from "react";
import { Button, Spinner, Tabs, Tab, Card, CardBody, Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@heroui/react";
import { addToast } from "@heroui/toast";
import TableInventory from "../Components/Inventory/TableInventory";
import TableInventorySupport from "../Components/Inventory/TableInventorySupport";
import '../style/inventoryManager.css';
import { getCategoryIdByName } from '../utils/functions/selectNameCategoryOptions';
import { useDispatch, useSelector } from 'react-redux';
import {
    getAdminAccountsByCategoryId,
    createAdminAccount,
    updateAdminAccount,
    deleteAdminAccount,
    importAdminAccountsFromExcel,
    getSupportAccountsByCategoryId,
    createSupportAccount,
    updateSupportAccount,
    deleteSupportAccount,
    importSupportAccountsFromExcel,
    sendAdminAccountToSupport,
    getDashboardStats,
    convertToStock,
    reportAccountIssue
} from '../features/InventoryManager/InventoryManagerSlice';
import AdminAccountModal from "../Components/Inventory/AdminAccountModal";
import SupportAccountModal from "../Components/Inventory/SupportAccountModal";
import useErrorHandler from '../Helpers/useErrorHandler';
import ConfirmModal from "../Components/ui/ConfirmModal";
import FileUpload from "../Components/ui/FileUpload";
import { Table, Box, LifeBuoy, TrendingUp, Clock, Star } from 'lucide-react';
import PublishWizardModal from "../Components/Inventory/PublishWizardModal";

export default function Inventory() {
    const [activeTab, setActiveTab] = useState("ventas");
    const [categorySelectedOne, setCategorySelectedOne] = useState('netflix');
    const [categorySelectedTwo, setCategorySelectedTwo] = useState('netflix');
    const [globalFilter, setGlobalFilter] = useState('');

    // Estado para el modal de soporte
    const [supportModalVisible, setSupportModalVisible] = useState(false);
    const [isSupportEditMode, setIsSupportEditMode] = useState(false);
    const [selectedSupportAccount, setSelectedSupportAccount] = useState(null);
    const [supportImportDialogVisible, setSupportImportDialogVisible] = useState(false);
    const [isLoadingSupportImport, setIsLoadingSupportImport] = useState(false);

    // Estado Redux
    const dispatch = useDispatch();
    const { adminAccount, supportAccount, dashboardStats } = useSelector((state) => state.inventoryManager);
    const { error, success } = useSelector((state) => state.error);
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [loading, setLoading] = useState(false);
    const [importDialogVisible, setImportDialogVisible] = useState(false);
    const [isLoadingImport, setIsLoadingImport] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [supportSelectedFile, setSupportSelectedFile] = useState(null);

    // Confirm modal state
    const [confirmOpen, setConfirmOpen] = useState(false);
    const [confirmAction, setConfirmAction] = useState(null);
    const [confirmMessage, setConfirmMessage] = useState('');
    const [confirmTitle, setConfirmTitle] = useState('');

    // Wizard state
    const [wizardVisible, setWizardVisible] = useState(false);
    const [wizardAccount, setWizardAccount] = useState(null);
    const [wizardType, setWizardType] = useState('admin');

    const handleErrors = useErrorHandler(error, success);

    useEffect(() => {
        handleErrors();
    }, [error, success, handleErrors]);

    useEffect(() => {
        dispatch(getDashboardStats());
    }, [dispatch]);

    useEffect(() => {
        if (activeTab === "ventas") {
            const categoryId = getCategoryIdByName(categorySelectedOne);
            if (categoryId) {
                dispatch(getAdminAccountsByCategoryId(categoryId));
            }
        }
    }, [dispatch, categorySelectedOne, activeTab]);

    useEffect(() => {
        if (activeTab === "soporte") {
            const categoryId = getCategoryIdByName(categorySelectedTwo);
            if (categoryId) {
                dispatch(getSupportAccountsByCategoryId(categoryId));
            }
        }
    }, [dispatch, categorySelectedTwo, activeTab]);

    // --- Handlers para el Modal de Admin Accounts --- 
    const handleShowCreateModal = () => {
        setSelectedAccount(null);
        setIsEditMode(false);
        setModalVisible(true);
    };

    const handleShowEditModal = (account) => {
        setSelectedAccount(account);
        setIsEditMode(true);
        setModalVisible(true);
    };

    const handleHideModal = () => {
        setModalVisible(false);
        setSelectedAccount(null);
    };

    const handleFormSubmit = async (accountData) => {
        setLoading(true);
        try {
            const categoryId = getCategoryIdByName(categorySelectedOne);
            if (isEditMode) {
                await dispatch(updateAdminAccount(selectedAccount.id, accountData, categoryId));
            } else {
                await dispatch(createAdminAccount(accountData, categoryId));
            }
            handleHideModal();
        } catch (err) {
            console.error("Error al guardar la cuenta:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = (accountId) => {
        setConfirmTitle('Confirmación de Eliminación');
        setConfirmMessage('¿Estás seguro de que quieres eliminar esta cuenta?');
        setConfirmAction(() => async () => {
            const categoryId = getCategoryIdByName(categorySelectedOne);
            if (categoryId) {
                try {
                    await dispatch(deleteAdminAccount(accountId, categoryId));
                } catch (err) {
                    console.error("Error al eliminar la cuenta:", err);
                }
            }
        });
        setConfirmOpen(true);
    };

    const handleSendToSupport = (id) => {
        setConfirmTitle('Confirmación de Envío a Soporte');
        setConfirmMessage('¿Estás seguro de que quieres enviar esta cuenta a soporte?');
        setConfirmAction(() => async () => {
            const categoryId = getCategoryIdByName(categorySelectedOne);
            if (categoryId) {
                dispatch(sendAdminAccountToSupport(id, categoryId));
            }
        });
        setConfirmOpen(true);
    };

    const handleReportIssue = (id, type) => {
        const categorySelected = type === 'admin' ? categorySelectedOne : categorySelectedTwo;
        setConfirmTitle('Reportar Caída de Cuenta');
        setConfirmMessage('Esto marcará la cuenta como caída y afectará a los clientes vinculados. ¿Continuar?');
        setConfirmAction(() => async () => {
            const categoryId = getCategoryIdByName(categorySelected);
            await dispatch(reportAccountIssue(id, type));
            if (type === 'admin') dispatch(getAdminAccountsByCategoryId(categoryId));
            else dispatch(getSupportAccountsByCategoryId(categoryId));
        });
        setConfirmOpen(true);
    };

    const handleOpenPublishWizard = (account, type) => {
        setWizardAccount(account);
        setWizardType(type);
        setWizardVisible(true);
    };

    const handlePublishToStock = async (publishData) => {
        const categorySelected = wizardType === 'admin' ? categorySelectedOne : categorySelectedTwo;
        setLoading(true);
        try {
            await dispatch(convertToStock(publishData));
            setWizardVisible(false);
            const categoryId = getCategoryIdByName(categorySelected);
            if (wizardType === 'admin') dispatch(getAdminAccountsByCategoryId(categoryId));
            else dispatch(getSupportAccountsByCategoryId(categoryId));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleShowImportDialog = () => setImportDialogVisible(true);
    const handleHideImportDialog = () => {
        setImportDialogVisible(false);
        setSelectedFile(null);
    };

    const handleImport = async () => {
        if (!selectedFile) return;
        const formData = new FormData();
        formData.append('excelFile', selectedFile);
        const categoryId = getCategoryIdByName(categorySelectedOne);
        if (!categoryId) {
            addToast({ title: 'Error', description: 'Seleccione una categoría válida antes de importar.', color: 'danger' });
            return;
        }
        setLoading(true);
        setIsLoadingImport(true);
        try {
            await dispatch(importAdminAccountsFromExcel(formData, categoryId));
            handleHideImportDialog();
        } catch (err) {
            console.error("Error al importar cuentas:", err);
        } finally {
            setLoading(false);
            setIsLoadingImport(false);
        }
    };

    // --- Handlers para el Modal de Support Accounts --- 
    const handleShowSupportCreateModal = () => {
        setSelectedSupportAccount(null);
        setIsSupportEditMode(false);
        setSupportModalVisible(true);
    };

    const handleShowSupportEditModal = (account) => {
        setSelectedSupportAccount(account);
        setIsSupportEditMode(true);
        setSupportModalVisible(true);
    };

    const handleHideSupportModal = () => {
        setSupportModalVisible(false);
        setSelectedSupportAccount(null);
    };

    const handleSupportFormSubmit = async (accountData) => {
        setLoading(true);
        try {
            const categoryId = getCategoryIdByName(categorySelectedTwo);
            if (isSupportEditMode && selectedSupportAccount) {
                await dispatch(updateSupportAccount(selectedSupportAccount.id, accountData, categoryId));
            } else {
                await dispatch(createSupportAccount(accountData, categoryId));
            }
            handleHideSupportModal();
            addToast({
                title: 'Éxito',
                description: isSupportEditMode ? 'Cuenta actualizada correctamente' : 'Cuenta creada correctamente',
                color: 'success'
            });
        } catch (err) {
            console.error("Error al guardar la cuenta de soporte:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteSupportAccount = (accountId) => {
        setConfirmTitle('Confirmación de Eliminación');
        setConfirmMessage('¿Estás seguro de que quieres eliminar esta cuenta de soporte?');
        setConfirmAction(() => async () => {
            const categoryId = getCategoryIdByName(categorySelectedTwo);
            if (categoryId) {
                try {
                    await dispatch(deleteSupportAccount(accountId, categoryId));
                } catch (err) {
                    console.error("Error al eliminar la cuenta de soporte:", err);
                }
            }
        });
        setConfirmOpen(true);
    };

    const handleShowSupportImportDialog = () => setSupportImportDialogVisible(true);
    const handleHideSupportImportDialog = () => {
        setSupportImportDialogVisible(false);
        setSupportSelectedFile(null);
    };

    const handleSupportImport = async () => {
        if (!supportSelectedFile) return;
        const formData = new FormData();
        formData.append('excelFile', supportSelectedFile);
        const categoryId = getCategoryIdByName(categorySelectedTwo);
        if (!categoryId) {
            addToast({ title: 'Error', description: 'Seleccione una categoría válida antes de importar.', color: 'danger' });
            return;
        }
        setLoading(true);
        setIsLoadingSupportImport(true);
        try {
            await dispatch(importSupportAccountsFromExcel(formData, categoryId));
            handleHideSupportImportDialog();
        } catch (err) {
            console.error("Error al importar cuentas de soporte:", err);
        } finally {
            setLoading(false);
            setIsLoadingSupportImport(false);
        }
    };

    const handleConfirm = async () => {
        if (confirmAction) {
            await confirmAction();
        }
        setConfirmOpen(false);
    };

    return (
        <div className="animate-fade-in relative overflow-hidden pt-8 pb-12 bg-white dark:bg-zinc-950 min-h-screen">
            {/* Background Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -right-24 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 -left-24 w-[500px] h-[500px] bg-indigo-100/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10 px-4">
                <ConfirmModal
                    isOpen={confirmOpen}
                    onClose={() => setConfirmOpen(false)}
                    onConfirm={handleConfirm}
                    title={confirmTitle}
                    message={confirmMessage}
                />

                {/* Header Section */}
                <div className="flex items-center gap-6">
                    <div className="p-5 bg-white shadow-lg rounded-2xl">
                        <Table size={32} className="text-slate-900" />
                    </div>
                    <div>
                        <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Gestión de Inventario</h2>
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mt-1">ADMINISTRA TUS CUENTAS Y STOCK</p>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <Card className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow">
                        <CardBody className="flex flex-row items-center gap-5 overflow-visible">
                            <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600">
                                <TrendingUp size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">MARGEN PROMEDIO</p>
                                <p className={`text-3xl font-extrabold ${dashboardStats.averageMargin >= 0 ? 'text-emerald-900' : 'text-rose-900'}`}>
                                    $ {dashboardStats.averageMargin?.toLocaleString() || 0}
                                </p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow">
                        <CardBody className="flex flex-row items-center gap-5 overflow-visible">
                            <div className="p-4 bg-amber-50 rounded-2xl text-amber-600">
                                <Clock size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">VENCEN EN 3 DÍAS</p>
                                <p className="text-3xl font-extrabold text-amber-900">{dashboardStats.expiringCount || 0}</p>
                            </div>
                        </CardBody>
                    </Card>

                    <Card className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm hover:shadow-md transition-shadow">
                        <CardBody className="flex flex-row items-center gap-5 overflow-visible">
                            <div className="p-4 bg-indigo-50 rounded-2xl text-indigo-600">
                                <Star size={28} />
                            </div>
                            <div>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">PROVEEDOR TOP</p>
                                <p className="text-lg font-extrabold text-slate-900 leading-tight">
                                    {dashboardStats.topSupplier ? `${dashboardStats.topSupplier.name} (${dashboardStats.topSupplier.stability}%)` : 'N/A'}
                                </p>
                            </div>
                        </CardBody>
                    </Card>
                </div>

                {/* Main Content with Tabs */}
                <div className="flex flex-col gap-6">
                    <Tabs
                        selectedKey={activeTab}
                        onSelectionChange={setActiveTab}
                        radius="full"
                        variant="light"
                        classNames={{
                            tabList: "gap-4 p-1.5 bg-slate-100/50 backdrop-blur-md rounded-2xl w-fit border border-slate-200/60",
                            cursor: "bg-slate-900 shadow-lg",
                            tab: "h-10 px-8",
                            tabContent: "font-bold uppercase text-[11px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-500"
                        }}
                    >
                        <Tab
                            key="ventas"
                            title={
                                <div className="flex items-center gap-2">
                                    <Box size={16} />
                                    <span>INVENTARIO VENTAS</span>
                                </div>
                            }
                        />
                        <Tab
                            key="soporte"
                            title={
                                <div className="flex items-center gap-2">
                                    <LifeBuoy size={16} />
                                    <span>INVENTARIO SOPORTE</span>
                                </div>
                            }
                        />
                    </Tabs>

                    <div className="animate-fade-in px-2">
                        {activeTab === "ventas" ? (
                            <TableInventory
                                accountsData={adminAccount || []}
                                onEdit={handleShowEditModal}
                                onDelete={handleDeleteAccount}
                                handleShowCreateModal={handleShowCreateModal}
                                handleShowImportDialog={handleShowImportDialog}
                                categorySelected={categorySelectedOne}
                                setCategorySelected={setCategorySelectedOne}
                                isLoadingImport={isLoadingImport}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                handleSendToSupport={handleSendToSupport}
                                onPublish={handleOpenPublishWizard}
                                onReportIssue={handleReportIssue}
                            />
                        ) : (
                            <TableInventorySupport
                                accountsData={supportAccount || []}
                                onEdit={handleShowSupportEditModal}
                                onDelete={handleDeleteSupportAccount}
                                handleShowCreateModal={handleShowSupportCreateModal}
                                handleShowImportDialog={handleShowSupportImportDialog}
                                categorySelected={categorySelectedTwo}
                                setCategorySelected={setCategorySelectedTwo}
                                isLoadingImport={isLoadingSupportImport}
                                globalFilter={globalFilter}
                                setGlobalFilter={setGlobalFilter}
                                onPublish={handleOpenPublishWizard}
                                onReportIssue={handleReportIssue}
                            />
                        )}
                    </div>
                </div>

                <AdminAccountModal
                    visible={modalVisible}
                    onHide={handleHideModal}
                    onSubmit={handleFormSubmit}
                    initialData={selectedAccount}
                />

                <SupportAccountModal
                    visible={supportModalVisible}
                    onHide={handleHideSupportModal}
                    onSubmit={handleSupportFormSubmit}
                    initialData={selectedSupportAccount}
                />

                {/* Dialogo para Importar Excel Admin */}
                <Modal
                    isOpen={importDialogVisible}
                    onClose={handleHideImportDialog}
                    size="lg"
                    classNames={{
                        base: "rounded-[2rem] border border-slate-100 shadow-2xl",
                        header: "border-b border-slate-100 py-6 px-8",
                        footer: "border-t border-slate-100 py-6 px-8",
                        closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
                    }}
                >
                    <ModalContent className="bg-white">
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold text-slate-800">Importar Cuentas</h2>
                            <span className="text-sm font-medium text-slate-500">Carga masiva de cuentas administrativas desde Excel</span>
                        </ModalHeader>
                        <ModalBody className="py-8 px-8">
                            <FileUpload
                                onFileSelect={setSelectedFile}
                                accept=".xlsx, .xls"
                                label="SELECCIONAR EXCEL"
                                showPreview={false}
                                className="w-full"
                            />
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mt-4">
                                Arrastra y suelta el archivo aquí o selecciona uno
                            </p>
                            {loading && (
                                <div className="flex items-center justify-center gap-3 mt-4 bg-slate-50 p-2 rounded-lg">
                                    <Spinner size="sm" color="default" />
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Procesando archivo...</span>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="bordered"
                                onPress={handleHideImportDialog}
                                className="font-bold border-slate-200 text-slate-600 uppercase tracking-widest text-[10px]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg"
                                onPress={handleImport}
                                isDisabled={!selectedFile || loading}
                                isLoading={loading}
                            >
                                Importar Datos
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                {/* Dialogo para Importar Excel Soporte */}
                <Modal
                    isOpen={supportImportDialogVisible}
                    onClose={handleHideSupportImportDialog}
                    size="lg"
                    classNames={{
                        base: "rounded-[2rem] border border-slate-100 shadow-2xl",
                        header: "border-b border-slate-100 py-6 px-8",
                        footer: "border-t border-slate-100 py-6 px-8",
                        closeButton: "hover:bg-slate-100 active:bg-slate-200 rounded-full transition-colors right-4 top-4"
                    }}
                >
                    <ModalContent className="bg-white">
                        <ModalHeader className="flex flex-col gap-1">
                            <h2 className="text-xl font-bold text-slate-800">Importar Soporte</h2>
                            <span className="text-sm font-medium text-slate-500">Carga masiva de cuentas de soporte desde Excel</span>
                        </ModalHeader>
                        <ModalBody className="py-8 px-8">
                            <FileUpload
                                onFileSelect={setSupportSelectedFile}
                                accept=".xlsx, .xls"
                                label="SELECCIONAR EXCEL"
                                showPreview={false}
                                className="w-full"
                            />
                            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center mt-4">
                                Arrastra y suelta el archivo aquí o selecciona uno
                            </p>
                            {loading && (
                                <div className="flex items-center justify-center gap-3 mt-4 bg-slate-50 p-2 rounded-lg">
                                    <Spinner size="sm" color="default" />
                                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Procesando archivo...</span>
                                </div>
                            )}
                        </ModalBody>
                        <ModalFooter>
                            <Button
                                variant="bordered"
                                onPress={handleHideSupportImportDialog}
                                className="font-bold border-slate-200 text-slate-600 uppercase tracking-widest text-[10px]"
                            >
                                Cancelar
                            </Button>
                            <Button
                                className="bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg"
                                onPress={handleSupportImport}
                                isDisabled={!supportSelectedFile || loading}
                                isLoading={loading}
                            >
                                Importar Datos
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>

                <PublishWizardModal
                    isOpen={wizardVisible}
                    onClose={() => setWizardVisible(false)}
                    techAccount={wizardAccount}
                    type={wizardType}
                    onPublish={handlePublishToStock}
                />
            </div>
        </div>
    );
}
