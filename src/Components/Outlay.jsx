import { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteOutlay } from "../features/outlay/OutlaySlice";
import CreateOutlay from "./Outlay/CreateOutlay";
import EditOutlay from "./Outlay/EditOutlay";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Button,
  Chip,
  Select,
  SelectItem,
  Pagination,
  Tooltip,
} from "@heroui/react";
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import ConfirmModal from "./ui/ConfirmModal";

function Outlay({ searchDate = new Date(), outlaysData = [] }) {
  const dispatch = useDispatch();
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [dataOutlayEdit, setDataOutlayEdit] = useState({});
  const [outlayToDelete, setOutlayToDelete] = useState(null);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Filters
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const statuses = [
    { label: "Todos", value: "all" },
    { label: "Pagado", value: "pagado" },
    { label: "Pendiente", value: "pendiente" }
  ];

  const types = [
    { label: "Todos", value: "all" },
    { label: "Nómina", value: "nomina" },
    { label: "Inventario", value: "inventario" },
    { label: "Pago a proveedores", value: "pago a proveedores" },
    { label: "Otros", value: "otros" }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "pagado":
        return "success";
      case "pendiente":
        return "warning";
      default:
        return "default";
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "pago a proveedores":
        return "primary";
      case "inventario":
        return "default";
      case "nomina":
        return "secondary";
      case "otros":
        return "success";
      default:
        return "default";
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleEdit = (rowData) => {
    setDataOutlayEdit(rowData);
    setShowEditModal(true);
  };

  const handleDeleteClick = (rowData) => {
    setOutlayToDelete(rowData);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (outlayToDelete) {
      dispatch(deleteOutlay(outlayToDelete.id, searchDate));
      setIsConfirmOpen(false);
      setOutlayToDelete(null);
    }
  };

  // Filtered data
  const filteredData = outlaysData.filter((item) => {
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesType = typeFilter === "all" || item.type === typeFilter;
    return matchesStatus && matchesType;
  });

  // Paginated data
  const pages = Math.ceil(filteredData.length / rowsPerPage);
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const columns = [
    { key: "name", label: "DESCRIPCIÓN" },
    { key: "amount", label: "MONTO" },
    { key: "type", label: "TIPO" },
    { key: "paymentMethod", label: "MÉTODO" },
    { key: "status", label: "ESTADO" },
    { key: "createdAt", label: "FECHA" },
    { key: "actions", label: "ACCIONES" },
  ];

  const renderCell = (item, columnKey) => {
    switch (columnKey) {
      case "name":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-bold text-slate-800">{item.name}</span>
            {item.referendPayment && (
              <span className="text-[10px] text-slate-400">Ref: {item.referendPayment}</span>
            )}
          </div>
        );
      case "amount":
        return (
          <span className="font-bold text-rose-600">
            ${new Intl.NumberFormat().format(item.amount)}
          </span>
        );
      case "type":
        return (
          <Chip size="sm" variant="flat" color={getTypeColor(item.type)} className="capitalize">
            {item.type}
          </Chip>
        );
      case "paymentMethod":
        return (
          <span className="px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-bold border border-slate-200 capitalize">
            {item.paymentMethod}
          </span>
        );
      case "status":
        return (
          <Chip size="sm" variant="flat" color={getStatusColor(item.status)} className="capitalize">
            {item.status}
          </Chip>
        );
      case "createdAt":
        return <span className="text-slate-500 text-xs font-medium">{formatDate(item.createdAt)}</span>;
      case "actions":
        return (
          <div className="flex gap-1 justify-center">
            <Tooltip content="Editar">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-slate-400 hover:text-amber-500 transition-colors"
                onPress={() => handleEdit(item)}
              >
                <Pencil size={18} />
              </Button>
            </Tooltip>
            <Tooltip content="Eliminar">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                className="text-slate-400 hover:text-rose-500 transition-colors"
                onPress={() => handleDeleteClick(item)}
              >
                <Trash2 size={18} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey];
    }
  };

  const topContent = (
    <div className="flex flex-col gap-4 mb-4">
      <div className="flex flex-col md:flex-row justify-between gap-4 items-end">
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto flex-1">
          <Select
            labelPlacement="outside"
            className="w-full sm:max-w-[200px]"
            placeholder="ESTADO"
            variant="underlined"
            selectedKeys={statusFilter ? [statusFilter] : []}
            onSelectionChange={(keys) => setStatusFilter([...keys][0] || "all")}
            classNames={{
              trigger: "border-slate-200",
              value: "text-slate-700 font-semibold"
            }}
          >
            {statuses.map((status) => (
              <SelectItem key={status.value} className="text-slate-700">
                {status.label}
              </SelectItem>
            ))}
          </Select>

          <Select
            labelPlacement="outside"
            className="w-full sm:max-w-[200px]"
            placeholder="TIPO"
            variant="underlined"
            selectedKeys={typeFilter ? [typeFilter] : []}
            onSelectionChange={(keys) => setTypeFilter([...keys][0] || "all")}
            classNames={{
              trigger: "border-slate-200",
              value: "text-slate-700 font-semibold"
            }}
          >
            {types.map((type) => (
              <SelectItem key={type.value} className="text-slate-700">
                {type.label}
              </SelectItem>
            ))}
          </Select>
        </div>

        <Button
          className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] shadow-lg hover:bg-slate-800"
          startContent={<Plus size={16} />}
          onPress={() => setShowModal(true)}
        >
          Nuevo Gasto
        </Button>
      </div>
    </div>
  );

  const bottomContent = (
    <div className="flex w-full justify-between items-center py-4 border-t border-slate-100 mt-4">
      <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">
        Total {filteredData.length} gastos
      </span>
      {pages > 1 && (
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
      )}
    </div>
  );

  return (
    <>
      <CreateOutlay
        show={showModal}
        onHide={() => setShowModal(false)}
        searchDate={searchDate}
      />
      <EditOutlay
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        searchDate={searchDate}
        gastoAEditar={dataOutlayEdit}
      />

      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Confirmar eliminación"
        message={`¿Estás seguro de que quieres eliminar este gasto? ${outlayToDelete ? `"${outlayToDelete.name}" ($${outlayToDelete.amount})` : ''}`}
        confirmLabel="Eliminar"
        cancelLabel="Cancelar"
      />

      {/* Table */}
      <Table
        aria-label="Tabla de gastos"
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
          items={paginatedData}
          emptyContent={
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <div className="p-4 bg-slate-50 rounded-full mb-2">
                <Search size={24} className="opacity-50" />
              </div>
              <p className="font-bold text-sm">No se encontraron gastos</p>
            </div>
          }
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
    </>
  );
}

export default Outlay;
