import { useEffect, useState, useMemo, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Input,
  Button,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Chip,
  Pagination,
  Tooltip,
} from "@heroui/react";
import { Search, Plus, Download, Edit, Trash2, MoreVertical, FileSpreadsheet, FileText, Upload, Users } from "lucide-react";
import { getCustomers, deleteCustomer } from "../features/customer/customerSlice";
import CreateCustomer from "../Components/Customers/CreateCustomer";
import EditCustomer from "../Components/Customers/EditCustomer";
import UploadExcelCustomers from "../Components/Customers/UploadExcelCustomers";
import ConfirmModal from "../Components/ui/ConfirmModal";
import { addToast } from "@heroui/toast";
import * as xlsx from "xlsx";
import jsPDF from "jspdf";
import { PageContainer, PremiumHeader, PremiumCard } from "../Components/ui/PremiumComponents";

const INITIAL_VISIBLE_COLUMNS = ["fullName", "email", "phone", "isActive", "lastPurchaseDate", "daysRemaining", "actions"];

const columns = [
  { name: "NOMBRE", uid: "fullName", sortable: true },
  { name: "CORREO", uid: "email", sortable: true },
  { name: "TELÉFONO", uid: "phone", sortable: true },
  { name: "ESTADO", uid: "isActive", sortable: true },
  { name: "ULT. COMPRA", uid: "lastPurchaseDate", sortable: true },
  { name: "RESTA SERVICIO", uid: "daysRemaining" },
  { name: "ACCIONES", uid: "actions" },
];

export default function Customer() {
  const dispatch = useDispatch();
  const { customers = [], isLoading } = useSelector((state) => state.customers);
  const [filterValue, setFilterValue] = useState("");
  const [selectedKeys, setSelectedKeys] = useState(new Set([]));
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [sortDescriptor, setSortDescriptor] = useState({
    column: "fullName",
    direction: "ascending",
  });

  // Modal states
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    dispatch(getCustomers());
  }, [dispatch]);

  const hasSearchFilter = Boolean(filterValue);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...customers];

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) =>
        user.fullName?.toLowerCase().includes(filterValue.toLowerCase()) ||
        user.email?.toLowerCase().includes(filterValue.toLowerCase())
      );
    }

    return filteredUsers;
  }, [customers, filterValue]);

  const sortedItems = useMemo(() => {
    return [...filteredItems].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, filteredItems]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return sortedItems.slice(start, end);
  }, [page, sortedItems, rowsPerPage]);

  /** Placeholder items para mostrar filas skeleton cuando está cargando */
  const skeletonPlaceholders = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ __skeleton: true, id: `skeleton-${i}` })),
    []
  );

  const tableItems = isLoading ? skeletonPlaceholders : items;

  const handleDeleteClick = (customer) => {
    setSelectedCustomer(customer);
    setShowConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (selectedCustomer) {
      dispatch(deleteCustomer(selectedCustomer.id));
      addToast({ title: "Éxito", description: "Cliente eliminado correctamente", color: "success" });
      setShowConfirm(false);
      setSelectedCustomer(null);
    }
  };

  const handleEditClick = (customer) => {
    setSelectedCustomer(customer);
    setShowEdit(true);
  };

  const calculateDaysRemaining = (lastPurchaseDate) => {
    if (!lastPurchaseDate) return null;
    try {
      const fecha = new Date(lastPurchaseDate);
      const anio = fecha.getFullYear();
      const mes = fecha.getMonth() + 1;
      const dia = fecha.getDate();
      let fechaProximoMes = new Date(anio, mes, dia);

      if (fechaProximoMes.getMonth() !== mes % 12) {
        fechaProximoMes = new Date(anio, mes + 1, 0);
      }

      const hoy = new Date();
      const fechaHoy = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate());
      const diferenciaMs = fechaProximoMes - fechaHoy;
      const diffDays = Math.round(diferenciaMs / (1000 * 60 * 60 * 24));

      return diffDays;
    } catch (error) {
      return null;
    }
  };

  const renderCell = useCallback((user, columnKey) => {
    if (user?.__skeleton) {
      return (
        <div className="h-4 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse w-3/4 max-w-[120px]" />
      );
    }

    const cellValue = user[columnKey];

    switch (columnKey) {
      case "fullName":
        return (
          <div className="flex flex-col">
            <p className="text-sm font-extrabold text-slate-900 tracking-tight capitalize">{cellValue}</p>
          </div>
        );
      case "isActive":
        return (
          <Chip
            className="capitalize gap-1 px-1 h-7 border-none"
            color={cellValue === "activo" ? "success" : "danger"}
            size="sm"
            variant="flat"
            classNames={{
              content: "font-bold text-[10px] uppercase tracking-wider text-inherit"
            }}
          >
            {cellValue === "activo" ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "lastPurchaseDate":
        if (!cellValue) return <Chip size="sm" variant="flat" color="default">No registra</Chip>;
        const date = new Date(cellValue);
        return (
          <div className="flex flex-col">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
          </div>
        )
      case "daysRemaining":
        const days = calculateDaysRemaining(user.lastPurchaseDate);
        if (days === null) return <Chip size="sm" variant="flat" color="default">No registra</Chip>;

        let color = "success";
        let text = `${days} días`;

        if (days === 0) {
          color = "warning";
          text = "Vence hoy";
        } else if (days < 0) {
          color = "danger";
          text = "Vencido";
        }

        return (
          <Chip size="sm" variant="flat" color={color} classNames={{ content: "font-bold text-[10px] uppercase tracking-wider" }}>
            {text}
          </Chip>
        );

      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            <Tooltip content="Contactar WhatsApp" className="bg-slate-900 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg">
              <a href={`http://wa.me/${user.phone}`} target="_blank" rel="noreferrer" className="text-lg text-emerald-600 hover:text-emerald-700 cursor-pointer active:opacity-50 transition-colors bg-emerald-50 p-2 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-message-circle"><path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" /></svg>
              </a>
            </Tooltip>
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones" className="rounded-xl">
                <DropdownItem startContent={<Edit size={16} />} onPress={() => handleEditClick(user)} className="font-semibold text-slate-700">
                  Editar
                </DropdownItem>
                <DropdownItem startContent={<Trash2 size={16} />} className="text-danger font-semibold" color="danger" onPress={() => handleDeleteClick(user)}>
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, []);

  const onNextPage = useCallback(() => {
    if (page < Math.ceil(filteredItems.length / rowsPerPage)) {
      setPage(page + 1);
    }
  }, [page, filteredItems.length, rowsPerPage]);

  const onPreviousPage = useCallback(() => {
    if (page > 1) {
      setPage(page - 1);
    }
  }, [page]);

  const onRowsPerPageChange = useCallback((e) => {
    setRowsPerPage(Number(e.target.value));
    setPage(1);
  }, []);

  const exportExcel = () => {
    const dataToExport = sortedItems;

    if (!dataToExport.length) {
      addToast({
        title: "Sin datos para exportar",
        description: "No hay clientes en el listado actual.",
        color: "warning",
      });
      return;
    }

    const exportData = dataToExport.map((customer) => ({
      Nombre: customer.fullName,
      Correo: customer.email,
      Teléfono: customer.phone,
      Estado: customer.isActive === "activo" ? "Activo" : "Inactivo",
      "Última compra": customer.lastPurchaseDate
        ? new Date(customer.lastPurchaseDate).toLocaleDateString("es-ES")
        : "No registra",
      "Días restantes servicio":
        calculateDaysRemaining(customer.lastPurchaseDate) ?? "",
    }));

    const worksheet = xlsx.utils.json_to_sheet(exportData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, "Clientes");

    const date = new Date().toISOString().slice(0, 10);
    const filename = `clientes-${date}.xlsx`;
    xlsx.writeFile(workbook, filename);

    addToast({
      title: "Exportación completada",
      description: `Se exportaron ${exportData.length} clientes a ${filename}`,
      color: "success",
    });
  };

  const exportPdf = () => {
    const dataToExport = sortedItems;

    if (!dataToExport.length) {
      addToast({
        title: "Sin datos para exportar",
        description: "No hay clientes en el listado actual.",
        color: "warning",
      });
      return;
    }

    const doc = new jsPDF("p", "pt", "a4");

    doc.setFontSize(14);
    doc.text("Reporte de Clientes", 40, 40);

    doc.setFontSize(9);
    const headerY = 60;
    const lineHeight = 16;

    // Posiciones de columnas pensadas para dar más espacio a nombre y correo
    const columnXs = [40, 220, 380, 460, 540, 650];
    const headers = ["Nombre", "Correo", "Teléfono", "Estado", "Última compra", "Días servicio"];

    headers.forEach((h, index) => {
      doc.text(h, columnXs[index], headerY);
    });

    // Filas
    let y = headerY + lineHeight;
    dataToExport.forEach((customer) => {
      const row = [
        customer.fullName || "",
        customer.email || "",
        customer.phone || "",
        customer.isActive === "activo" ? "Activo" : "Inactivo",
        customer.lastPurchaseDate
          ? new Date(customer.lastPurchaseDate).toLocaleDateString("es-ES")
          : "No registra",
        String(calculateDaysRemaining(customer.lastPurchaseDate) ?? ""),
      ];

      row.forEach((rawVal, index) => {
        let val = String(rawVal);
        // Evitar que nombre/correo se monten sobre otras columnas
        if (index === 0 && val.length > 28) {
          val = `${val.slice(0, 25)}...`;
        }
        if (index === 1 && val.length > 32) {
          val = `${val.slice(0, 29)}...`;
        }
        doc.text(val, columnXs[index], y);
      });

      y += lineHeight;
      if (y > doc.internal.pageSize.getHeight() - 40) {
        doc.addPage();
        y = 60;
      }
    });

    const date = new Date().toISOString().slice(0, 10);
    const filename = `clientes-${date}.pdf`;
    doc.save(filename);

    addToast({
      title: "Exportación completada",
      description: `Se exportaron ${dataToExport.length} clientes a ${filename}`,
      color: "success",
    });
  };

  const topContent = useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row justify-between gap-3 items-end">
          <Input
            isClearable
            className="w-full sm:max-w-[44%]"
            placeholder="Buscar por nombre, correo..."
            startContent={<Search className="text-default-300" />}
            value={filterValue}
            onClear={() => setFilterValue("")}
            onValueChange={setFilterValue}
            size="md"
            variant="underlined"
            classNames={{
              base: "w-full md:max-w-md",
              input: "text-base font-bold text-slate-900",
              inputWrapper: "border-slate-200 h-12",
              innerWrapper: "pb-1"
            }}
          />
          <div className="flex gap-3">
            <Dropdown>
              <DropdownTrigger>
                <Button variant="light" startContent={<Download size={18} />} className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
                  Exportar
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Exportar" className="rounded-xl">
                <DropdownItem startContent={<FileSpreadsheet size={18} />} onPress={exportExcel} className="font-semibold text-slate-700">
                  Excel
                </DropdownItem>
                <DropdownItem startContent={<FileText size={18} />} onPress={exportPdf} className="font-semibold text-slate-700">
                  PDF
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
            <Button className="bg-emerald-50 text-emerald-600 font-bold uppercase tracking-wider text-[11px]" startContent={<Upload size={18} />} onPress={() => setShowUpload(true)}>
              Subir Excel
            </Button>
            <div className="hidden md:block">
              {/* Spacer only visible on larger screens if needed, otherwise buttons stack */}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-default-400 text-small">Total {customers.length} clientes</span>
          <label className="flex items-center text-default-400 text-small">
            Filas por página:
            <select
              className="bg-transparent outline-none text-default-400 text-small"
              onChange={onRowsPerPageChange}
            >
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
          </label>
        </div>
      </div>
    );
  }, [filterValue, onRowsPerPageChange, customers.length]);

  const bottomContent = useMemo(() => {
    return (
      <div className="py-2 px-2 flex justify-between items-center">
        <Pagination
          showControls
          showShadow
          color="primary"
          isDisabled={hasSearchFilter}
          page={page}
          total={Math.ceil(filteredItems.length / rowsPerPage)}
          variant="light"
          onChange={setPage}
          classNames={{
            wrapper: "gap-2 overflow-visible h-8 rounded-full border border-slate-200 shadow-sm bg-white",
            item: "w-8 h-8 text-[10px] font-bold bg-transparent text-slate-500 data-[hover=true]:bg-slate-50",
            cursor: "bg-slate-900 shadow-lg font-bold text-white",
          }}
        />
        <span className="text-small text-default-400">
          {selectedKeys === "all"
            ? "Todos seleccionados"
            : `${selectedKeys.size} de ${items.length} seleccionados`}
        </span>
      </div>
    );
  }, [selectedKeys, items.length, page, hasSearchFilter, rowsPerPage, filteredItems.length]);

  return (
    <PageContainer>
      <PremiumHeader
        title="Clientes"
        description="Gestiona la base de clientes, sus estados y renovaciones."
        icon={Users}
        action={
          <Button
            className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition-all"
            endContent={<Plus />}
            onPress={() => setShowCreate(true)}
          >
            Nuevo Cliente
          </Button>
        }
      />

      <PremiumCard>
        <Table
          aria-label="Tabla de clientes"
          isHeaderSticky
          removeWrapper
          bottomContent={bottomContent}
          bottomContentPlacement="outside"
          classNames={{
            wrapper: "max-h-[600px]",
          }}
          selectedKeys={isLoading ? new Set([]) : selectedKeys}
          selectionMode={isLoading ? "none" : "multiple"}
          sortDescriptor={sortDescriptor}
          topContent={topContent}
          topContentPlacement="outside"
          onSelectionChange={setSelectedKeys}
          onSortChange={setSortDescriptor}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === "actions" ? "center" : "start"}
                allowsSorting={column.sortable}
                className="bg-transparent text-slate-400 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100"
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            emptyContent={
              <div className="py-20 text-center">
                <Users size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron clientes</p>
              </div>
            }
            items={tableItems}
          >
            {(item) => (
              <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                {(columnKey) => <TableCell className="py-4">{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PremiumCard>

      <CreateCustomer show={showCreate} onHide={() => setShowCreate(false)} />
      {selectedCustomer && (
        <EditCustomer
          show={showEdit}
          onHide={() => { setShowEdit(false); setSelectedCustomer(null); }}
          dataEdit={selectedCustomer}
        />
      )}
      <UploadExcelCustomers show={showUpload} onClose={() => setShowUpload(false)} />

      <ConfirmModal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Cliente"
        message="¿Está seguro que desea eliminar este cliente? Esta acción no se puede deshacer."
        confirmColor="danger"
      />
    </PageContainer>
  );
}
