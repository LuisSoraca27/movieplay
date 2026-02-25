import { useEffect, useState, useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getOrdersDayById } from '../../features/orders/OrdersSlice';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Button,
    Pagination,
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Chip,
    Spinner,
    DateRangePicker,
} from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import { ShoppingBag, Eye, Package, CreditCard, History, Calendar } from "lucide-react";

const columns = [
    { name: "PRODUCTO", uid: "nameProduct", sortable: true },
    { name: "MÉTODO DE PAGO", uid: "paymentMethod", className: "hidden md:table-cell" },
    { name: "PRECIO", uid: "priceProduct", sortable: true },
    { name: "FECHA", uid: "createdAt", sortable: true, className: "hidden md:table-cell" },
    { name: "ACCIONES", uid: "actions" },
];

const OrderClient = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [sortDescriptor, setSortDescriptor] = useState({
        column: "createdAt",
        direction: "descending",
    });
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const [dateRange, setDateRange] = useState({
        start: today(getLocalTimeZone()),
        end: today(getLocalTimeZone()),
    });

    useEffect(() => {
        if (user?.role === 'admin') {
            navigate('/orders');
        }
    }, [user, navigate]);

    const { ordersById: ordersDay = [], isLoading } = useSelector(state => state.orders);

    useEffect(() => {
        if (user?.id) {
            dispatch(getOrdersDayById(user.id, dateRange));
        }
    }, [dispatch, user?.id, dateRange]);

    const handleShow = (order) => {
        setSelectedOrder(order);
        setShowModal(true);
    };

    const sortedItems = useMemo(() => {
        return [...ordersDay].sort((a, b) => {
            let first = a[sortDescriptor.column];
            let second = b[sortDescriptor.column];

            if (sortDescriptor.column === "priceProduct") {
                first = parseFloat(first) || 0;
                second = parseFloat(second) || 0;
            }

            const cmp = first < second ? -1 : first > second ? 1 : 0;
            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [sortDescriptor, ordersDay]);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedItems.slice(start, end);
    }, [page, sortedItems, rowsPerPage]);

    const renderCell = useCallback((order, columnKey) => {
        switch (columnKey) {
            case "nameProduct":
                return (
                    <div className="flex items-center gap-4">
                        <div className="bg-blue-50 p-2 rounded-xl border border-blue-100 hidden md:block">
                            <Package size={18} className="text-blue-600" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-slate-900 font-bold text-sm uppercase tracking-tight">
                                {order.nameProduct}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                                ID: {order.id ? String(order.id).slice(-8).toUpperCase() : 'N/A'}
                            </span>
                        </div>
                    </div>
                );
            case "paymentMethod":
                return (
                    <div className="flex items-center gap-2">
                        <CreditCard size={14} className="text-slate-400" />
                        <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wide">Saldo de Wallet</span>
                    </div>
                );
            case "priceProduct":
                return (
                    <span className="text-base font-extrabold text-slate-800">
                        ${new Intl.NumberFormat().format(order.priceProduct)}
                    </span>
                );
            case "createdAt":
                return (
                    <div className="flex flex-col">
                        <span className="text-slate-700 font-bold text-xs uppercase">
                            {new Date(order.createdAt).toLocaleDateString("es-ES", { day: 'numeric', month: 'short' })}
                        </span>
                        <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
                            {new Date(order.createdAt).toLocaleTimeString("es-ES", { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                );
            case "actions":
                return (
                    <Button
                        size="sm"
                        className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-8 px-4 rounded-lg shadow-md hover:bg-slate-800 transition-all"
                        startContent={<Eye size={12} strokeWidth={2.5} />}
                        onPress={() => handleShow(order)}
                    >
                        Detalles
                    </Button>
                );
            default:
                return order[columnKey];
        }
    }, []);

    const bottomContent = useMemo(() => {
        const totalPages = Math.ceil(ordersDay.length / rowsPerPage);
        if (totalPages <= 1) return null;

        return (
            <div className="py-2 px-2 flex justify-center items-center">
                <Pagination
                    showControls
                    classNames={{
                        cursor: "bg-slate-900 text-white font-bold",
                        item: "text-slate-400 font-bold uppercase text-[10px] tracking-widest",
                    }}
                    color="default"
                    page={page}
                    total={totalPages}
                    variant="light"
                    onChange={setPage}
                />
            </div>
        );
    }, [page, ordersDay.length, rowsPerPage]);

    return (
        <div className="animate-fade-in relative overflow-hidden pt-4 md:pt-8 pb-12">
            {/* Background Accents */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 w-[600px] h-[600px] bg-blue-100/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 -right-24 w-[500px] h-[500px] bg-indigo-100/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto space-y-10">
                {/* Header Section */}
                <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-200">
                    <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
                        <div className="bg-white p-5 rounded-2xl shadow-lg ring-1 ring-slate-200">
                            <ShoppingBag size={32} className="text-slate-800" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
                                Mis Compras
                            </h1>
                            <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mt-1">
                                Gestión y seguimiento de todos tus pedidos • {ordersDay.length} operaciones
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-4">
                        <DateRangePicker
                            className="max-w-xs"
                            variant="faded"
                            color="default"
                            startContent={<Calendar size={16} className="text-slate-500" />}
                            classNames={{
                                base: "bg-white",
                                label: "text-slate-500 font-bold uppercase text-[10px] tracking-wider",
                                input: "text-slate-700 font-bold text-sm",
                                innerWrapper: "gap-3",
                                segment: "text-slate-700 font-bold text-sm uppercase tracking-wide",
                            }}
                            value={dateRange}
                            onChange={setDateRange}
                        />
                        <div className="flex items-center gap-4 bg-white/60 p-1.5 rounded-xl border border-white/50 backdrop-blur-sm">
                            <select
                                className="bg-transparent outline-none text-slate-800 font-bold uppercase text-[10px] tracking-widest px-4 cursor-pointer"
                                onChange={(e) => {
                                    setRowsPerPage(Number(e.target.value));
                                    setPage(1);
                                }}
                                value={rowsPerPage}
                            >
                                <option value="10">10 Filas</option>
                                <option value="20">20 Filas</option>
                                <option value="50">50 Filas</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Table Content */}
                <div className="bg-white border border-slate-200 rounded-[2rem] overflow-hidden shadow-sm">
                    <Table
                        aria-label="Mis Compras"
                        removeWrapper
                        bottomContent={bottomContent}
                        bottomContentPlacement="outside"
                        sortDescriptor={sortDescriptor}
                        onSortChange={setSortDescriptor}
                        classNames={{
                            th: "bg-slate-50/50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100 h-14",
                            td: "py-5 border-b border-slate-50 last:border-none",
                        }}
                    >
                        <TableHeader columns={columns}>
                            {(column) => (
                                <TableColumn
                                    key={column.uid}
                                    align={column.uid === "actions" ? "center" : "start"}
                                    allowsSorting={column.sortable}
                                    className={column.className}
                                >
                                    {column.name}
                                </TableColumn>
                            )}
                        </TableHeader>
                        <TableBody
                            emptyContent={
                                <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                                    <Package size={56} strokeWidth={1.5} className="mb-4 opacity-30" />
                                    <p className="font-bold uppercase tracking-widest text-[11px]">Sin compras registradas</p>
                                </div>
                            }
                            items={items}
                            isLoading={isLoading}
                            loadingContent={<Spinner color="primary" />}
                        >
                            {(item) => (
                                <TableRow key={item.id || item.createdAt} className="hover:bg-slate-50/50 transition-colors">
                                    {(columnKey) => (
                                        <TableCell className={columns.find(c => c.uid === columnKey)?.className}>
                                            {renderCell(item, columnKey)}
                                        </TableCell>
                                    )}
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Detail Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                size="lg"
                backdrop="blur"
                classNames={{
                    base: "rounded-[2rem] bg-[#F1F1F2] p-2",
                    header: "border-b border-slate-200",
                    footer: "border-t border-slate-200"
                }}
            >
                <ModalContent className="bg-white rounded-[1.5rem] overflow-hidden">
                    {(onClose) => (
                        <>
                            <ModalHeader className="px-6 py-5">
                                <div className="flex flex-col">
                                    <span className="text-xl font-extrabold text-slate-900 tracking-tight">Detalle del Pedido</span>
                                    <span className="text-[10px] text-slate-400 font-bold tracking-wider uppercase">ID: {selectedOrder?.id ? String(selectedOrder.id).toUpperCase() : ''}</span>
                                </div>
                            </ModalHeader>
                            <ModalBody className="px-6 py-6">
                                {selectedOrder && (
                                    <div className="space-y-6">
                                        <div className="bg-slate-50/50 border border-slate-200 rounded-2xl p-5 space-y-4">
                                            <div className="flex justify-between items-center pb-3 border-b border-slate-200/50">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</span>
                                                <Chip className="bg-emerald-50 text-emerald-600 font-bold uppercase text-[9px] tracking-wider border-none">ENTREGADO</Chip>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Producto</span>
                                                <span className="text-sm font-bold text-slate-700 uppercase">{selectedOrder.nameProduct}</span>
                                            </div>

                                            <div className="flex justify-between items-center">
                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inversión</span>
                                                <span className="text-xl font-extrabold text-slate-800">
                                                    ${new Intl.NumberFormat().format(selectedOrder.priceProduct)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
                                            <History size={14} className="text-blue-500" />
                                            <span className="text-[10px] font-bold text-blue-700 uppercase tracking-wide">
                                                Procesada el {new Date(selectedOrder.createdAt).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </ModalBody>
                            <ModalFooter className="px-6 py-5">
                                <Button
                                    className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] px-8 h-11 rounded-lg w-full sm:w-auto shadow-md"
                                    onPress={onClose}
                                >
                                    Entendido
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </div>
    );
};

export default OrderClient;

