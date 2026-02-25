import { useEffect, useState, useMemo, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getOrdersById,
  searchOrdersByDate,
  downloadSales,
} from "../features/orders/OrdersSlice";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Pagination,
  Spinner,
  DatePicker,
} from "@heroui/react";
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import { Search, Download, ExternalLink, ShoppingCart, Calendar } from "lucide-react";
import Detailorder from "../Components/Order/Detailorder";
import formatDateForDB from "../utils/functions/formatDateForDB";
import IsLoading from "../Components/IsLoading";
import { PageContainer, PremiumHeader, PremiumCard } from "../Components/ui/PremiumComponents";

const Order = () => {
  const [date, setDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const handleClose = () => setShowModal(false);
  const [showModalExcel, setShowModalExcel] = useState(false);
  const [loading, setLoading] = useState(false);
  const [searchDate, setSearchDate] = useState(today(getLocalTimeZone()));
  const [idForSearch, setIdForSearch] = useState("");
  const [orders, setOrders] = useState([]);
  const [loadingPage, setLoadingPage] = useState(false);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const dispatch = useDispatch();

  const { ordersById, ordersByDate } = useSelector((state) => state.orders);

  const handleShow = (data) => {
    setData(data);
    setShowModal(true);
  };

  const handleDateChange = (value) => {
    if (value) {
      setSearchDate(value);
      const jsDate = value.toDate(getLocalTimeZone());
      dispatch(searchOrdersByDate(formatDateForDB(jsDate)));
    }
  };

  const handleIdChange = (e) => {
    const value = e.target.value.trim();
    setIdForSearch(value);

    if (value) {
      dispatch(getOrdersById(value));
    } else {
      const jsDate = searchDate.toDate(getLocalTimeZone());
      dispatch(searchOrdersByDate(formatDateForDB(jsDate)));
    }
  };

  const formatDate = (dateString) => {
    const createdAt = new Date(dateString);
    const dia = createdAt.getDate();
    const mes = createdAt.toLocaleString("es-ES", { month: "long" });
    const anio = createdAt.getFullYear();
    const hora = createdAt.getHours();
    const minutos = createdAt.getMinutes().toString().padStart(2, "0");
    return `${dia} de ${mes} ${anio}, ${hora}:${minutos}`;
  };

  const handleDownloadExcel = () => {
    if (!date) return;
    setLoading(true);
    const jsDate = date.toDate(getLocalTimeZone());
    dispatch(downloadSales(jsDate)).then(() => {
      setShowModalExcel(false);
      setLoading(false);
    });
  };

  // Pagination
  const pages = Math.ceil(orders.length / rowsPerPage);
  const paginatedOrders = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return orders.slice(start, end);
  }, [page, orders]);

  const columns = [
    { key: "id", label: "ID DE COMPRA" },
    { key: "nameProduct", label: "PRODUCTO" },
    { key: "username", label: "COMPRADOR" },
    { key: "priceProduct", label: "PRECIO" },
    { key: "createdAt", label: "FECHA DE COMPRA" },
    { key: "actions", label: "DETALLES" },
  ];

  const renderCell = useCallback((order, columnKey) => {
    switch (columnKey) {
      case "id":
        return (
          <span className="font-mono text-xs text-slate-500 font-bold tracking-wider">
            #{order.id.toString().slice(-6)}
          </span>
        );
      case "nameProduct":
        return (
          <span className="text-sm font-bold text-slate-800">
            {order.nameProduct}
          </span>
        );
      case "username":
        return (
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-[10px]">
              {order.username?.charAt(0) || "?"}
            </div>
            <span className="text-sm font-semibold text-slate-700">
              {order.username || "Desconocido"}
            </span>
          </div>
        );
      case "priceProduct":
        return <span className="font-bold text-emerald-600">${order.priceProduct}</span>;
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

  useEffect(() => {
    const jsDate = searchDate.toDate(getLocalTimeZone());
    dispatch(searchOrdersByDate(formatDateForDB(jsDate)));
  }, [dispatch, searchDate]);

  useEffect(() => {
    setOrders(idForSearch ? ordersById : ordersByDate);
    setPage(1);
  }, [ordersById, ordersByDate, idForSearch]);

  useEffect(() => {
    setLoadingPage(true);
    setTimeout(() => {
      setLoadingPage(false);
    }, 1000);
  }, []);

  if (loadingPage) {
    return <IsLoading />;
  }

  return (
    <PageContainer>
      <Detailorder
        showModal={showModal}
        handleClose={handleClose}
        data={data}
      />

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
          <ModalHeader className="flex flex-col gap-1">
            <div className="flex flex-col">
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Descargar ventas</span>
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Selecciona una fecha</span>
            </div>
          </ModalHeader>
          <ModalBody className="py-6">
            <DatePicker
              label="FECHA"
              labelPlacement="outside"
              value={date}
              onChange={setDate}
              isDisabled={loading}
              variant="bordered"
              classNames={{
                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                inputWrapper: "border-slate-200 h-12"
              }}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="light"
              onPress={() => setShowModalExcel(false)}
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
        </ModalContent>
      </Modal>

      {/* Header */}
      <PremiumHeader
        title="Ventas Externas"
        description="GESTIONA Y VISUALIZA EL HISTORIAL DE VENTAS"
        icon={ShoppingCart}
      />

      {/* Filtros */}
      <PremiumCard className="mt-8 overflow-visible">
        <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto flex-1">
            <Input
              isClearable
              placeholder="BUSCAR POR ID..."
              value={idForSearch}
              onChange={handleIdChange}
              onClear={() => setIdForSearch("")}
              startContent={<Search size={18} className="text-slate-400" />}
              size="lg"
              variant="underlined"
              classNames={{
                input: "text-slate-800 font-semibold",
                inputWrapper: "border-slate-200",
                label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]"
              }}
              className="w-full md:max-w-xs"
            />
            <div className="w-full md:max-w-xs">
              <DatePicker
                value={searchDate}
                onChange={handleDateChange}
                aria-label="Buscar por fecha"
                variant="underlined"
                classNames={{
                  inputWrapper: "border-slate-200"
                }}
              />
            </div>
          </div>
          <Button
            className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 rounded-xl shadow-md hover:bg-slate-800"
            startContent={<Download size={16} />}
            onPress={() => setShowModalExcel(true)}
          >
            Exportar
          </Button>
        </div>

        <Table
          aria-label="Tabla de ventas externas"
          classNames={{
            wrapper: "bg-transparent shadow-none p-0",
            th: "bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12",
            td: "group-data-[first=true]:first:before:rounded-none group-data-[first=true]:last:before:rounded-none bg-white border-b border-slate-100 py-4"
          }}
          bottomContent={
            pages > 1 && (
              <div className="flex w-full justify-center py-4">
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
            )
          }
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn key={column.key} align={column.key === "actions" ? "center" : "start"}>
                {column.label}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={paginatedOrders}
            emptyContent={
              <div className="flex flex-col items-center justify-center py-12 text-slate-400">
                <ShoppingCart size={48} className="opacity-20 mb-4" />
                <p className="font-bold">No hay ventas para mostrar</p>
              </div>
            }
            loadingContent={<Spinner size="lg" color="current" className="text-slate-900" />}
          >
            {(order) => (
              <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                {(columnKey) => (
                  <TableCell>{renderCell(order, columnKey)}</TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PremiumCard>
    </PageContainer>
  );
};

export default Order;
