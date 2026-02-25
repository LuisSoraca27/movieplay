import React, { useState, useRef, useMemo } from 'react';
import {
    Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
    Button, Input, Select, SelectItem, Chip, Pagination,
    Tooltip, Spinner
} from "@heroui/react";
import PropTypes from 'prop-types';
import PaymentProofModal from './PaymentProofModal';
import CreateSaleModal from './CreateSaleModal';
import EditSaleModal from './EditSaleModal';
import ConfirmModal from '../ui/ConfirmModal';
import { deleteDailySale, uploadDailySalesFromExcel } from '../../features/DailySale/dailySaleSlice';
import { useDispatch } from 'react-redux';
import { Search, Plus, Upload, Image, Pencil, Trash2 } from 'lucide-react';

const DailyTable = ({ salesData, searchTerm }) => {
    const dispatch = useDispatch();
    const fileUploadRef = useRef(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [verificationFilter, setVerificationFilter] = useState(null);
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [isProofModalVisible, setIsProofModalVisible] = useState(false);
    const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [isLoadingExcelUpload, setIsLoadingExcelUpload] = useState(false);
    const [selectedSale, setSelectedSale] = useState(null);
    const [selectedSaleForEdit, setSelectedSaleForEdit] = useState(null);
    const [showPaymentProof, setShowPaymentProof] = useState(false);

    // Confirm dialog state
    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const verificationOptions = [
        { label: 'Todos', value: 'all' },
        { label: 'Verificado', value: 'true' },
        { label: 'No Verificado', value: 'false' }
    ];

    const handleSaleSubmit = (formData) => {
        console.log('Form Data received in DailyTable:', formData);
        setIsCreateModalVisible(false);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP' }).format(amount);
    };

    const confirmDelete = (id) => {
        setDeleteId(id);
        setIsConfirmOpen(true);
    };

    const handleDelete = () => {
        if (deleteId) {
            dispatch(deleteDailySale(deleteId, searchTerm.toISOString()));
        }
        setIsConfirmOpen(false);
        setDeleteId(null);
    };

    const handleExcelFileSelect = async (event) => {
        const file = event.target.files[0];
        if (file) {
            setIsLoadingExcelUpload(true);
            const formData = new FormData();
            formData.append('excelFile', file);

            try {
                await dispatch(uploadDailySalesFromExcel(formData, searchTerm.toISOString()));
            } catch (error) {
                console.error('Fallo al subir Excel:', error);
            } finally {
                setIsLoadingExcelUpload(false);
                if (fileUploadRef.current) {
                    fileUploadRef.current.value = '';
                }
            }
        }
    };

    const triggerExcelUpload = () => {
        fileUploadRef.current?.click();
    };

    const handleShowPaymentProof = (sale) => {
        setSelectedSale(sale);
        setShowPaymentProof(true);
    };

    const handleEditSale = (sale) => {
        setSelectedSaleForEdit(sale);
        setIsEditModalVisible(true);
    };

    const handleHideEditModal = () => {
        setIsEditModalVisible(false);
        setSelectedSaleForEdit(null);
    };

    // Filter data
    const filteredData = useMemo(() => {
        return salesData.filter(sale => {
            const matchesGlobalFilter = Object.values(sale).some(value =>
                value?.toString().toLowerCase().includes(globalFilter.toLowerCase())
            );

            let matchesVerificationFilter = true;
            if (verificationFilter && verificationFilter !== 'all') {
                matchesVerificationFilter = sale.isVerified === (verificationFilter === 'true');
            }

            return matchesGlobalFilter && matchesVerificationFilter;
        });
    }, [salesData, globalFilter, verificationFilter]);

    // Pagination
    const pages = Math.ceil(filteredData.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return filteredData.slice(start, end);
    }, [page, filteredData, rowsPerPage]);

    const columns = [
        { key: 'customerName', label: 'CLIENTE' },
        { key: 'product', label: 'PRODUCTO' },
        { key: 'amount', label: 'MONTO' },
        { key: 'paymentMethod', label: 'MÉTODO' },
        { key: 'isVerified', label: 'ESTADO' },
        { key: 'createdAt', label: 'HORA' },
        { key: 'receipt', label: 'COMPROBANTE' },
        { key: 'actions', label: 'ACCIONES' },
    ];

    const renderCell = (sale, columnKey) => {
        switch (columnKey) {
            case 'customerName':
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-800">{sale.customerName}</span>
                        {sale.customerId && (
                            <span className="text-[10px] text-slate-400">ID: {sale.customerId}</span>
                        )}
                        {sale.whatsapp && (
                            <span className="text-[10px] text-slate-400">{sale.whatsapp}</span>
                        )}
                    </div>
                )
            case 'product':
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-700">{sale.product}</span>
                        {sale.reference && (
                            <span className="text-[10px] text-slate-400">Ref: {sale.reference}</span>
                        )}
                    </div>
                )
            case 'amount':
                return <span className="font-bold text-emerald-600">{formatCurrency(sale.amount)}</span>;
            case 'paymentMethod':
                return (
                    <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200">
                        {sale.paymentMethod}
                    </span>
                )
            case 'createdAt':
                return <span className="text-xs font-medium text-slate-500">{formatDate(sale.createdAt)}</span>;
            case 'isVerified':
                return (
                    <Chip
                        className={`${sale.isVerified ? "bg-emerald-100 text-emerald-700 border-emerald-200" : "bg-orange-100 text-orange-700 border-orange-200"} border`}
                        size="sm"
                        variant="flat"
                    >
                        {sale.isVerified ? 'Verificado' : 'Pendiente'}
                    </Chip>
                );
            case 'receipt':
                return (
                    <Tooltip content="Ver comprobante">
                        <Button
                            isIconOnly
                            variant="light"
                            size="sm"
                            className="text-slate-400 hover:text-indigo-600 transition-colors"
                            onPress={() => handleShowPaymentProof(sale)}
                        >
                            <Image size={18} />
                        </Button>
                    </Tooltip>
                );
            case 'actions':
                return (
                    <div className="flex gap-1 justify-center">
                        <Tooltip content="Editar">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                className="text-slate-400 hover:text-amber-500 transition-colors"
                                onPress={() => handleEditSale(sale)}
                            >
                                <Pencil size={18} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Eliminar">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                className="text-slate-400 hover:text-rose-500 transition-colors"
                                onPress={() => confirmDelete(sale.id)}
                            >
                                <Trash2 size={18} />
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return sale[columnKey] || '-';
        }
    };

    const topContent = (
        <div className="flex flex-col gap-4 mb-4">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
                <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
                    <Input
                        isClearable
                        className="w-full md:max-w-xs"
                        placeholder="BUSCAR VENTA..."
                        startContent={<Search size={18} className="text-slate-400" />}
                        value={globalFilter}
                        onClear={() => setGlobalFilter('')}
                        onValueChange={setGlobalFilter}
                        variant="underlined"
                        classNames={{
                            input: "text-slate-800 font-semibold",
                            inputWrapper: "border-slate-200",
                            label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]"
                        }}
                    />
                    <Select
                        className="w-full md:max-w-[200px]"
                        placeholder="ESTADO"
                        variant="underlined"
                        selectedKeys={verificationFilter ? [verificationFilter] : []}
                        onSelectionChange={(keys) => setVerificationFilter([...keys][0] || null)}
                        classNames={{
                            trigger: "border-slate-200",
                            value: "text-slate-700 font-semibold"
                        }}
                    >
                        {verificationOptions.map((option) => (
                            <SelectItem key={option.value} className="text-slate-700">
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <div className="flex gap-2">
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] shadow-lg hover:bg-slate-800"
                        onPress={() => setIsCreateModalVisible(true)}
                        startContent={<Plus size={16} />}
                    >
                        Nueva Venta
                    </Button>
                    <Button
                        variant="bordered"
                        className="border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px] hover:bg-slate-50"
                        onPress={triggerExcelUpload}
                        isLoading={isLoadingExcelUpload}
                        isDisabled={isLoadingExcelUpload}
                        startContent={!isLoadingExcelUpload && <Upload size={16} />}
                    >
                        Importar Excel
                    </Button>
                </div>
            </div>
        </div>
    );

    const bottomContent = (
        <div className="flex w-full justify-between items-center py-4 border-t border-slate-100 mt-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Total {filteredData.length} ventas
            </span>
            <Pagination
                isCompact
                showControls
                showShadow
                classNames={{
                    cursor: "bg-slate-900 text-white font-bold",
                    item: "bg-transparent text-slate-500 font-medium hover:bg-slate-100",
                }}
                page={page}
                total={pages}
                onChange={setPage}
            />
        </div>
    );

    return (
        <div className="w-full">
            <input
                type="file"
                ref={fileUploadRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls"
                onChange={handleExcelFileSelect}
            />

            <Table
                aria-label="Tabla de ventas diarias"
                topContent={topContent}
                bottomContent={bottomContent}
                topContentPlacement="outside"
                bottomContentPlacement="outside"
                classNames={{
                    wrapper: "bg-transparent shadow-none p-0",
                    th: "bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100",
                    td: "group-data-[first=true]:first:before:rounded-none group-data-[first=true]:last:before:rounded-none bg-white border-b border-slate-100 py-3"
                }}
            >
                <TableHeader columns={columns}>
                    {(column) => (
                        <TableColumn key={column.key} align={column.key === 'actions' ? 'center' : 'start'}>
                            {column.label}
                        </TableColumn>
                    )}
                </TableHeader>
                <TableBody
                    items={items}
                    emptyContent={
                        <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                            <div className="p-4 bg-slate-50 rounded-full mb-2">
                                <Search size={24} className="opacity-50" />
                            </div>
                            <p className="font-bold text-sm">No se encontraron ventas</p>
                        </div>
                    }
                    loadingContent={<Spinner size="lg" color="current" className="text-slate-900" />}
                >
                    {(item) => (
                        <TableRow key={item.id} className="hover:bg-slate-50/50 transition-colors">
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>

            <ConfirmModal
                isOpen={isConfirmOpen}
                onClose={() => setIsConfirmOpen(false)}
                onConfirm={handleDelete}
                title="Confirmación de Eliminación"
                message="¿Estás seguro de que quieres eliminar esta venta?"
                confirmLabel="Sí, eliminar"
                cancelLabel="No, cancelar"
            />

            <PaymentProofModal
                visible={showPaymentProof}
                onHide={() => setShowPaymentProof(false)}
                idDailySale={selectedSale?.id}
                initialVerificationStatus={selectedSale?.isVerified}
                searchTerm={searchTerm}
            />

            <CreateSaleModal
                visible={isCreateModalVisible}
                onHide={() => setIsCreateModalVisible(false)}
                onSubmitSale={handleSaleSubmit}
                searchTerm={searchTerm}
            />

            <EditSaleModal
                visible={isEditModalVisible}
                onHide={handleHideEditModal}
                saleData={selectedSaleForEdit}
                searchTerm={searchTerm}
            />
        </div>
    );
};

DailyTable.propTypes = {
    salesData: PropTypes.array.isRequired,
    searchTerm: PropTypes.instanceOf(Date)
};

export default DailyTable;
