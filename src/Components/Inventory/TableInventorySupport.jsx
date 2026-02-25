import React, { useState, useMemo } from 'react';
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Button, Input, Select, SelectItem, Chip, Pagination, Tooltip, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, User } from "@heroui/react";
import PropTypes from 'prop-types';
import { optionsCategory } from '../../utils/functions/selectNameCategoryOptions';
import { Search, Filter, Copy, ShoppingCart, AlertTriangle, ChevronDown, ChevronUp, Edit, Trash2, Send, Clock, User as UserIcon, Upload, Plus } from 'lucide-react';
import { addToast } from "@heroui/toast";

export default function TableInventorySupport({
    accountsData,
    onEdit,
    onDelete,
    categorySelected,
    setCategorySelected,
    isLoadingImport,
    globalFilter,
    setGlobalFilter,
    onPublish,
    onReportIssue,
    handleShowCreateModal,
    handleShowImportDialog
}) {
    const [statusFilter, setStatusFilter] = useState("all");
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [expandedRows, setExpandedRows] = useState(new Set());

    const toggleRow = (id) => {
        const newExpandedRows = new Set(expandedRows);
        if (newExpandedRows.has(id)) newExpandedRows.delete(id);
        else newExpandedRows.add(id);
        setExpandedRows(newExpandedRows);
    };

    const statusOptions = [
        { label: 'Todos', value: 'all' },
        { label: 'Disponible', value: 'disponible' },
        { label: 'Ocupada', value: 'ocupada' },
        { label: 'Caída', value: 'caida' },
    ];

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getRemainingDays = (endDateString) => {
        if (!endDateString) return null;
        const endDate = new Date(endDateString);
        const today = new Date();
        const diffTime = endDate - today;
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    };

    const sortedItems = useMemo(() => {
        let filtered = [...accountsData];

        if (globalFilter) {
            filtered = filtered.filter((item) =>
                Object.values(item).some(
                    (value) =>
                        value &&
                        value.toString().toLowerCase().includes(globalFilter.toLowerCase())
                )
            );
        }

        if (statusFilter !== "all" && statusFilter) {
            filtered = filtered.filter(account => account.status === statusFilter);
        }

        return filtered;
    }, [accountsData, globalFilter, statusFilter]);

    const pages = Math.ceil(sortedItems.length / rowsPerPage);
    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const columns = [
        { key: 'supplier', label: 'PROVEEDOR' },
        { key: 'email', label: 'CUENTA' },
        { key: 'service_days', label: 'DÍAS' },
        { key: 'end_date', label: 'VENCIMIENTO' },
        { key: 'status', label: 'ESTADO' },
        { key: 'profiles_toggle', label: 'PERFILES' },
        { key: 'actions', label: 'ACCIONES' },
    ];

    const renderCell = (item, columnKey) => {
        const cellValue = item[columnKey];

        switch (columnKey) {
            case 'email':
                return (
                    <User
                        name={item.email}
                        description={item.password ? `Pass: ••••••` : 'No password'}
                        classNames={{
                            name: "font-semibold text-slate-700",
                            description: "text-slate-400 text-xs"
                        }}
                        avatarProps={{
                            radius: "lg",
                            src: `https://ui-avatars.com/api/?name=${item.supplier}&background=6366f1&color=fff`,
                            size: "sm"
                        }}
                    />
                );
            case 'supplier':
                return (
                    <div className="flex flex-col">
                        <span className="text-sm font-bold text-slate-700">{item.supplier}</span>
                        <span className="text-xs text-slate-400">ID: {item.id}</span>
                    </div>
                );
            case "status":
                const statusColorMap = {
                    disponible: "success",
                    ocupada: "warning",
                    caida: "danger",
                };
                return (
                    <Chip className="capitalize font-bold border-none" color={statusColorMap[item.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "delivery_date":
            case "end_date":
                const days = getRemainingDays(item.end_date);
                const isExpired = days !== null && days <= 0;
                return (
                    <div className="flex flex-col">
                        <span className={`text-sm font-bold ${isExpired ? 'text-rose-500' : 'text-slate-600'}`}>
                            {formatDate(cellValue)}
                        </span>
                        <div className="flex items-center gap-1">
                            <Clock size={12} className={isExpired ? "text-rose-400" : "text-emerald-500"} />
                            <span className="text-[10px] font-bold text-slate-400">
                                {days !== null ? (days > 0 ? `${days} DÍAS` : "VENCIDO") : "IND."}
                            </span>
                        </div>
                    </div>
                );
            case "account_status":
                return cellValue;
            case "service_days":
                return (
                    <Chip size="sm" variant="flat" classNames={{ base: "bg-slate-100", content: "font-bold text-slate-600" }}>
                        {cellValue} DÍAS
                    </Chip>
                );
            case "actions":
                return (
                    <div className="flex items-center justify-center gap-1">
                        <Tooltip content="Copiar Datos" color="foreground">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => {
                                    const textToCopy = `Email: ${item.email}\nContraseña: ${item.password}\nPin: ${item.pin || 'N/A'}\nProveedor: ${item.supplier}`;
                                    navigator.clipboard.writeText(textToCopy);
                                    addToast({
                                        title: 'Éxito',
                                        description: 'Datos copiados al portapapeles',
                                        color: 'success',
                                        timeout: 2000
                                    });
                                }}
                                className="text-slate-400 hover:text-indigo-600"
                            >
                                <Copy size={18} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Publicar para Venta" color="foreground">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => onPublish(item, 'support')}
                                className="text-slate-400 hover:text-emerald-600"
                            >
                                <ShoppingCart size={18} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Reportar Caída" color="danger">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => onReportIssue(item.id, 'support')}
                                className="text-slate-400 hover:text-amber-500"
                            >
                                <AlertTriangle size={18} />
                            </Button>
                        </Tooltip>
                        <Tooltip content="Editar" color="secondary">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => onEdit(item)}
                                className="text-slate-400 hover:text-blue-500"
                            >
                                <Edit size={18} />
                            </Button>
                        </Tooltip>
                        <Tooltip color="danger" content="Eliminar">
                            <Button
                                isIconOnly
                                variant="light"
                                size="sm"
                                onPress={() => onDelete(item.id)}
                                className="text-slate-400 hover:text-rose-500"
                            >
                                <Trash2 size={18} />
                            </Button>
                        </Tooltip>
                    </div>
                );
            case "profiles_toggle":
                const hasProfiles = item.profile1 || item.profile2 || item.profile3 || item.profile4 || item.profile5;
                if (!hasProfiles) return <span className="text-slate-300 text-xs">N/A</span>;
                const isExpanded = expandedRows.has(item.id);
                return (
                    <Button
                        isIconOnly
                        variant="light"
                        size="sm"
                        onPress={() => toggleRow(item.id)}
                        className={`text-slate-400 ${isExpanded ? 'rotate-180' : ''} transition-transform`}
                    >
                        <ChevronDown size={18} />
                    </Button>
                );
            default:
                return cellValue;
        }
    };

    const inputClasses = {
        label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
        input: "text-slate-700 font-semibold",
        inputWrapper: "bg-white border-slate-200 group-hover:border-slate-300 focus-within:!border-slate-900 shadow-sm",
    };

    const topContent = (
        <div className="flex flex-col gap-6 mb-4">
            <div className="flex justify-between gap-3 items-end flex-wrap">
                <div className="flex gap-3 items-center flex-wrap flex-1">
                    <Select
                        className="w-[200px]"
                        label="CATEGORÍA"
                        labelPlacement="outside"
                        placeholder="Selecciona categoría"
                        variant="bordered"
                        classNames={inputClasses}
                        selectedKeys={categorySelected ? [categorySelected] : []}
                        onSelectionChange={(keys) => setCategorySelected([...keys][0]?.toLowerCase() || null)}
                    >
                        {optionsCategory.map((option) => (
                            <SelectItem key={option.name.toLowerCase()} value={option.name.toLowerCase()}>
                                {option.name}
                            </SelectItem>
                        ))}
                    </Select>

                    <Input
                        isClearable
                        className="w-full sm:max-w-[240px]"
                        label="BÚSQUEDA GENERAL"
                        labelPlacement="outside"
                        placeholder="Buscar por email..."
                        startContent={<Search className="text-slate-400" size={16} />}
                        value={globalFilter}
                        onValueChange={setGlobalFilter}
                        variant="bordered"
                        classNames={inputClasses}
                        onClear={() => setGlobalFilter('')}
                    />

                    <Select
                        className="w-[180px]"
                        label="ESTADO"
                        labelPlacement="outside"
                        placeholder="Todos"
                        variant="bordered"
                        classNames={inputClasses}
                        selectedKeys={statusFilter ? [statusFilter] : []}
                        onSelectionChange={(keys) => setStatusFilter([...keys][0] || "all")}
                    >
                        {statusOptions.map((option) => (
                            <SelectItem key={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </Select>
                </div>

                {/* Added Buttons for Consistency */}
                <div className="flex gap-2">
                    <Button
                        variant="bordered"
                        className="font-bold border-slate-200 text-slate-600 uppercase tracking-widest text-[10px]"
                        onPress={handleShowImportDialog}
                        isLoading={isLoadingImport}
                        isDisabled={isLoadingImport}
                        startContent={!isLoadingImport && <Upload size={16} />}
                    >
                        Importar Excel
                    </Button>
                    <Button
                        className="bg-slate-900 text-white font-bold uppercase tracking-widest text-[10px] shadow-lg hover:bg-slate-800"
                        onPress={handleShowCreateModal}
                        startContent={<Plus size={16} />}
                    >
                        Nueva Cuenta
                    </Button>
                </div>
            </div>
        </div>
    );

    const bottomContent = (
        <div className="flex w-full justify-between items-center mt-4">
            <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
                Total {sortedItems.length} cuentas
            </span>
            <Pagination
                isCompact
                showControls
                showShadow
                color="primary"
                page={page}
                total={pages || 1}
                onChange={setPage}
                classNames={{
                    cursor: "bg-slate-900 shadow-md",
                }}
            />
            <Select
                className="w-[100px]"
                size="sm"
                variant="bordered"
                classNames={inputClasses}
                selectedKeys={[rowsPerPage.toString()]}
                onSelectionChange={(keys) => {
                    setRowsPerPage(Number([...keys][0]));
                    setPage(1);
                }}
            >
                <SelectItem key="5">5</SelectItem>
                <SelectItem key="10">10</SelectItem>
                <SelectItem key="25">25</SelectItem>
                <SelectItem key="50">50</SelectItem>
            </Select>
        </div>
    );

    // Flatten items to include expanded detail rows
    const flatItems = useMemo(() => {
        const result = [];
        items.forEach(item => {
            result.push({ ...item, _type: 'data' });
            if (expandedRows.has(item.id)) {
                result.push({ id: `${item.id}-expanded`, _type: 'expanded', _parent: item });
            }
        });
        return result;
    }, [items, expandedRows]);


    return (
        <Table
            aria-label="Tabla de soporte"
            topContent={topContent}
            bottomContent={bottomContent}
            topContentPlacement="outside"
            bottomContentPlacement="outside"
            classNames={{
                wrapper: "bg-white shadow-none border border-slate-200 rounded-[2rem] p-0 overflow-hidden",
                th: "bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100",
                td: "py-3 px-4 border-b border-slate-50 group-last:border-none",
                tab: "shadow-none"
            }}
        >
            <TableHeader columns={columns}>
                {(column) => (
                    <TableColumn key={column.key} align={column.key === 'actions' || column.key === 'profiles_toggle' ? 'center' : 'start'}>
                        {column.label}
                    </TableColumn>
                )}
            </TableHeader>
            <TableBody items={flatItems} emptyContent={"No se encontraron cuentas"}>
                {(item) => {
                    if (item._type === 'expanded') {
                        const parent = item._parent;
                        return (
                            <TableRow key={item.id} className="bg-slate-50/50 hover:bg-slate-50/50">
                                <TableCell colSpan={columns.length}>
                                    <div className="py-4 px-6">
                                        <div className="flex gap-4 flex-wrap">
                                            {[1, 2, 3, 4, 5].map(num => (
                                                parent[`profile${num}`] && (
                                                    <div key={num} className="bg-white border border-slate-200 p-3 rounded-xl flex items-center gap-3 shadow-sm min-w-[200px]">
                                                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                                                            P{num}
                                                        </div>
                                                        <span className="text-sm font-semibold text-slate-700">{parent[`profile${num}`]}</span>
                                                    </div>
                                                )
                                            ))}
                                        </div>
                                        {/* Added observation if present in support model (not always but good to have) */}
                                        {parent.observation && (
                                            <div className="mt-4 p-3 bg-amber-50 rounded-xl text-amber-800 text-xs flex gap-2 items-start max-w-2xl">
                                                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                                                <span>{parent.observation}</span>
                                            </div>
                                        )}
                                    </div>
                                </TableCell>
                                {columns.slice(1).map((_, idx) => <TableCell key={idx} className="hidden" />)}
                            </TableRow>
                        );
                    }
                    return (
                        <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors">
                            {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                        </TableRow>
                    );
                }}
            </TableBody>
        </Table>
    );
}

TableInventorySupport.propTypes = {
    accountsData: PropTypes.array.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    categorySelected: PropTypes.string.isRequired,
    setCategorySelected: PropTypes.func.isRequired,
    isLoadingImport: PropTypes.bool,
    globalFilter: PropTypes.string,
    setGlobalFilter: PropTypes.func.isRequired,
    onPublish: PropTypes.func.isRequired,
    onReportIssue: PropTypes.func.isRequired,
    handleShowCreateModal: PropTypes.func.isRequired,
    handleShowImportDialog: PropTypes.func.isRequired
};
