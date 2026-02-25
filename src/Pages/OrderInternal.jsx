import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  searchOrdersInternalByDate,
  getOrdersInternalById,
  downloadSalesInternal,
} from "../features/ordersInternal/ordersIternalSlice";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  Pagination,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Chip
} from "@heroui/react";
import { Search, ShoppingCart, Download, ExternalLink, Calendar, Plus } from "lucide-react";
import formatDateForDB from "../utils/functions/formatDateForDB";
import DetailOrderInternal from "../Components/Order/DetailOrderInternal";
import IsLoading from "../Components/IsLoading";
import { PageContainer, PremiumHeader, PremiumCard } from "../Components/ui/PremiumComponents";

const columns = [
  { name: "ID DE COMPRA", uid: "id", sortable: true },
  { name: "PRODUCTO", uid: "product", sortable: true },
  { name: "CLIENTE", uid: "customer", sortable: true },
  { name: "MÉTODO DE PAGO", uid: "paymentMethod", sortable: true },
  { name: "REFERENCIA", uid: "paymentReference", sortable: true },
  { name: "FECHA DE COMPRA", uid: "createdAt", sortable: true },
  { name: "DETALLES", uid: "actions" },
];

function OrderInternal() {
  const [date, setDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => setShowModal(false);
  const [showModalExcel, setShowModalExcel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [idForSearch, setIdForSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "createdAt",
    direction: "descending",
  });

  const dispatch = useDispatch();

  const { ordersById, ordersByDate, isLoading } = useSelector(
    (state) => state.ordersInternal
  );

  const handleShow = (rowData) => {
    setData(rowData);
    setShowModal(true);
  };

  const handleDateChange = (e) => {
    const value = e.target.value;
    setSearchDate(value);
    if (value) {
      dispatch(searchOrdersInternalByDate(formatDateForDB(new Date(value))));
    }
  };

  const handleIdChange = (value) => {
    setIdForSearch(value);

    if (value) {
      dispatch(getOrdersInternalById(value));
    } else {
      dispatch(searchOrdersInternalByDate(formatDateForDB(new Date(searchDate))));
    }
  };

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    const dia = createdAt.getDate();
    const mes = createdAt.toLocaleString("es-ES", { month: "long" });
    const anio = createdAt.getFullYear();
    const hora = createdAt.getHours();
    const minutos = createdAt.getMinutes().toString().padStart(2, '0');
    return `${dia} de ${mes} ${anio}, ${hora}:${minutos}`;
  };

  const handleDownloadExcel = () => {
    if (!date) return;
    setLoading(true);
    dispatch(downloadSalesInternal(new Date(date))).then(() => {
      setShowModalExcel(false);
      setLoading(false);
      setDate("");
    });
  };

  useEffect(() => {
    dispatch(searchOrdersInternalByDate(formatDateForDB(new Date(searchDate))));
  }, [dispatch]);

  useEffect(() => {
    setOrders(idForSearch ? ordersById : ordersByDate);
  }, [ordersById, ordersByDate, idForSearch]);

  useEffect(() => {
    setLoadingPage(true);
    setTimeout(() => {
      setLoadingPage(false);
    }, 500);
  }, []);

  const sortedItems = useMemo(() => {
    return [...orders].sort((a, b) => {
      let first = a[sortDescriptor.column];
      let second = b[sortDescriptor.column];

      if (sortDescriptor.column === "product") {
        first = a.productDetails?.name || a.productDetails?.combo?.name || "";
        second = b.productDetails?.name || b.productDetails?.combo?.name || "";
      } else if (sortDescriptor.column === "customer") {
        first = a.customer?.fullName || "";
        second = b.customer?.fullName || "";
      }

      const cmp = first < second ? -1 : first > second ? 1 : 0;
      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, orders]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const renderCell = useCallback((order, columnKey) => {
    switch (columnKey) {
      case "id":
        return (
          <span className="font-mono text-xs text-slate-500 font-bold tracking-wider">
            #{order.id.toString().slice(-6)}
          </span>
        );
      case "product":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">
              {order.productDetails?.name || order.productDetails?.combo?.name || "—"}
            </span>
          </div>
        );
      case "customer":
        return (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
              {order.customer?.fullName?.charAt(0) || "?"}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {order.customer?.fullName || "Desconocido"}
            </span>
          </div>
        );
      case "paymentMethod":
        return (
          <Chip size="sm" variant="flat" className="capitalize" classNames={{ content: "font-bold text-[10px] tracking-wider" }}>
            {order.paymentMethod || "—"}
          </Chip>
        );
      case "paymentReference":
        return (
          <span className="text-sm text-slate-500 font-mono">
            {order.paymentReference || "—"}
          </span>
        );
      case "createdAt":
        return (
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-700">
              {new Date(order.createdAt).toLocaleDateString()}
            </span>
            <span className="text-[10px] text-slate-400">
              {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        );
      case "actions":
        return (
          <Button
            isIconOnly
            size="sm"
            className="bg-white border border-slate-200 text-slate-600 shadow-sm hover:bg-slate-50"
            onPress={() => handleShow(order)}
          >
            <ExternalLink size={16} />
          </Button>
        );
      default:
        return order[columnKey];
    }
  }, []);

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            placeholder="BUSCAR POR ID..."
            startContent={<Search className="text-slate-400" size={18} />}
            value={idForSearch}
            onClear={() => handleIdChange("")}
            onValueChange={handleIdChange}
            size="lg"
            variant="underlined"
            classNames={{
              input: "text-slate-800 font-semibold",
              inputWrapper: "border-slate-200",
              label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]"
            }}
          />
          <div className="flex gap-3 items-center w-full md:w-auto">
            <div className="relative flex-1 md:flex-none">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar size={18} className="text-slate-400" />
              </div>
              <input
                type="date"
                value={searchDate}
                onChange={handleDateChange}
                className="pl-10 pr-3 py-2.5 w-full border-b-2 border-slate-200 bg-transparent text-sm font-semibold text-slate-700 focus:outline-none focus:border-slate-900 transition-colors"
              />
            </div>

            <Button
              className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 rounded-xl shadow-md hover:bg-slate-800"
              startContent={<Download size={16} />}
              onPress={() => setShowModalExcel(true)}
            >
              Exportar
            </Button>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Total {orders.length} ventas
          </span>
          <label className="flex items-center text-slate-400 font-bold uppercase tracking-wider text-[10px]">
            Filas por página:
            <select
              className="bg-transparent outline-none text-slate-600 font-bold ml-2 cursor-pointer"
              onChange={onRowsPerPageChange}
              value={rowsPerPage}
            >
              <option value="20">20</option>
              <option value="30">30</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [idForSearch, searchDate, orders.length, onRowsPerPageChange, rowsPerPage]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          classNames={{
            cursor: "bg-slate-900 text-white font-bold",
            item: "bg-transparent text-slate-500 font-medium hover:bg-slate-100",
          }}
          total={Math.ceil(orders.length / rowsPerPage) || 1}
          page={page}
          variant="light"
          onChange={setPage}
        />
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
          {items.length} de {orders.length} registros
        </span>
      </div>
    );
  }, [page, orders.length, rowsPerPage, items.length]);

  if (loadingPage) {
    return <IsLoading />;
  }

  return (
    <PageContainer>
      <DetailOrderInternal
        showModal={showModal}
        handleClose={handleClose}
        data={data}
      />

      {/* Header */}
      <PremiumHeader
        title="Ventas Internas"
        description="GESTIONA Y REGISTRA LAS VENTAS MANUALES"
        icon={ShoppingCart}
      />

      <PremiumCard className="mt-6">
        <Table
          aria-label="Tabla de ventas internas"
          isHeaderSticky
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "bg-transparent shadow-none p-0",
            th: "bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12",
            td: "group-data-[first=true]:first:before:rounded-none group-data-[first=true]:last:before:rounded-none bg-white border-b border-slate-100 py-4"
          }}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ShoppingCart size={48} className="opacity-20 mb-4" />
                <p className="font-bold">No se encontraron ventas</p>
              </div>
            }
            items={items}
            isLoading={isLoading}
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
      </PremiumCard>

      {/* Modal para descargar Excel */}
      <Modal
        isOpen={showModalExcel}
        onClose={() => setShowModalExcel(false)}
        size="sm"
        classNames={{
          base: "bg-white border border-slate-200 shadow-2xl rounded-[2rem]",
          header: "border-b border-slate-100 pb-4",
          footer: "border-t border-slate-100 pt-4"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="text-xl font-extrabold text-slate-900 tracking-tight">Descargar ventas</span>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selecciona una fecha</span>
              </ModalHeader>
              <ModalBody className="py-6">
                <Input
                  type="date"
                  label="FECHA"
                  labelPlacement="outside"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  variant="bordered"
                  classNames={{
                    label: "text-slate-400 font-bold tracking-wider text-[10px]",
                    input: "text-slate-800 font-semibold",
                    inputWrapper: "border-slate-200 h-12"
                  }}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  variant="light"
                  onPress={onClose}
                  isDisabled={loading}
                  className="font-bold text-slate-500 uppercase tracking-wider text-[11px]"
                >
                  Cancelar
                </Button>
                <Button
                  className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] shadow-lg"
                  onPress={handleDownloadExcel}
                  isLoading={loading}
                  isDisabled={!date || loading}
                  startContent={!loading && <Download size={16} />}
                >
                  Descargar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </PageContainer>
  );
}

export default OrderInternal;
