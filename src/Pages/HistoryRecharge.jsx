import { useEffect, useState, useMemo } from "react";
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
  Chip,
  Pagination,
} from "@heroui/react";
import { Search, Calendar as CalendarIcon, History } from "lucide-react";
import {
  getHistoryRechargeByDate,
  getHistoryRechargeByEmail,
  getHistoryRechargeById,
} from "../features/historyRecharge/HistoryRechargeSlice";
import { PageContainer, PremiumHeader, PremiumCard } from "../Components/ui/PremiumComponents";

function HistoryRecharge() {
  const dispatch = useDispatch();

  // States for filters
  const [searchDate, setSearchDate] = useState(new Date().toISOString().split('T')[0]);
  const [searchEmail, setSearchEmail] = useState("");
  const [searchId, setSearchId] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  const { historyRecharge, loading } = useSelector(
    (state) => state.historyRecharge
  );

  useEffect(() => {
    // Initial load or date change
    dispatch(getHistoryRechargeByDate(searchDate));
  }, [searchDate]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDateChange = (e) => {
    setSearchDate(e.target.value);
  };

  const searchById = () => {
    if (!searchId) return;
    dispatch(getHistoryRechargeById(searchId));
  };

  const searchByEmail = () => {
    if (!searchEmail) return;
    dispatch(getHistoryRechargeByEmail(searchEmail));
  };

  // Pagination logic (client-side of the fetched result)
  const items = useMemo(() => {
    if (!historyRecharge) return [];
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return historyRecharge.slice(start, end);
  }, [page, historyRecharge]);

  const totalPages = Math.ceil((historyRecharge?.length || 0) / rowsPerPage);

  return (
    <PageContainer>
      {/* Header */}
      <PremiumHeader
        title="Historial de Recargas"
        description="CONSULTA EL HISTÓRICO DE RECARGAS REALIZADAS POR FECHA, EMAIL O ID"
        icon={History}
      />

      {/* Filters */}
      <PremiumCard className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1 flex gap-4">
            <Input
              label="BUSCAR POR ID"
              placeholder="Escribe el ID..."
              labelPlacement="outside"
              value={searchId}
              onValueChange={setSearchId}
              startContent={<Search className="text-slate-400" size={18} />}
              variant="bordered"
              classNames={{
                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                input: "text-slate-800 font-semibold",
                inputWrapper: "border-slate-200 h-12 bg-slate-50/50"
              }}
            />
            <Button
              isIconOnly
              className="mt-6 bg-slate-900 text-white shadow-lg shadow-slate-900/20"
              onPress={searchById}
              isLoading={loading}
            >
              <Search size={20} />
            </Button>
          </div>

          <div className="flex-1 flex gap-4">
            <Input
              label="BUSCAR POR EMAIL"
              placeholder="nombre@ejemplo.com"
              labelPlacement="outside"
              value={searchEmail}
              onValueChange={setSearchEmail}
              startContent={<Search className="text-slate-400" size={18} />}
              variant="bordered"
              classNames={{
                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                input: "text-slate-800 font-semibold",
                inputWrapper: "border-slate-200 h-12 bg-slate-50/50"
              }}
            />
            <Button
              isIconOnly
              className="mt-6 bg-slate-900 text-white shadow-lg shadow-slate-900/20"
              onPress={searchByEmail}
              isLoading={loading}
            >
              <Search size={20} />
            </Button>
          </div>

          <div className="w-full md:w-auto">
            <Input
              type="date"
              label="FECHA"
              labelPlacement="outside"
              value={searchDate}
              onChange={handleDateChange}
              startContent={<CalendarIcon className="text-slate-400" size={18} />}
              variant="bordered"
              classNames={{
                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                input: "text-slate-800 font-semibold",
                inputWrapper: "border-slate-200 h-12 bg-slate-50/50"
              }}
            />
          </div>
        </div>
      </PremiumCard>

      {/* Table */}
      <PremiumCard className="p-0 overflow-hidden">
        <Table
          aria-label="Tabla de historial de recargas"
          shadow="none"
          classNames={{
            wrapper: "shadow-none p-0",
            th: "bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12",
            td: "py-4 text-slate-700 font-medium border-b border-slate-100 last:border-0"
          }}
          bottomContent={
            totalPages > 1 ? (
              <div className="flex w-full justify-center p-4 border-t border-slate-100">
                <Pagination
                  isCompact
                  showControls
                  showShadow
                  color="primary"
                  page={page}
                  total={totalPages}
                  onChange={(page) => setPage(page)}
                  classNames={{
                    cursor: "bg-slate-900 shadow-lg shadow-slate-900/20"
                  }}
                />
              </div>
            ) : null
          }
        >
          <TableHeader>
            <TableColumn>ID</TableColumn>
            <TableColumn>USUARIO</TableColumn>
            <TableColumn>EMAIL</TableColumn>
            <TableColumn>MONTO</TableColumn>
            <TableColumn>MÉTODO</TableColumn>
            <TableColumn>ESTADO</TableColumn>
            <TableColumn>FECHA</TableColumn>
          </TableHeader>
          <TableBody items={items} emptyContent="No se encontraron recargas">
            {(item) => (
              <TableRow key={item.id}>
                <TableCell className="font-mono text-xs text-slate-400 font-bold">{item.id}</TableCell>
                <TableCell className="capitalize font-bold text-slate-800">{item.username}</TableCell>
                <TableCell className="text-slate-500">{item.email}</TableCell>
                <TableCell className="font-bold text-emerald-600">
                  {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(item.amount)}
                </TableCell>
                <TableCell>
                  <Chip size="sm" variant="bordered" classNames={{ base: "border-slate-200", content: "font-bold text-slate-500 text-[10px] uppercase" }}>
                    {item.methodPayment || 'N/A'}
                  </Chip>
                </TableCell>
                <TableCell>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={item.status === "Completado" ? "success" : "danger"}
                    classNames={{
                      content: "font-bold tracking-wide text-[10px] uppercase",
                      base: item.status === "Completado" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                    }}
                    startContent={item.status === "Completado" ? <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-1"></span> : null}
                  >
                    {item.status}
                  </Chip>
                </TableCell>
                <TableCell className="text-slate-400 text-[11px] font-bold uppercase">
                  {new Date(item.createdAt).toLocaleString()}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PremiumCard>
    </PageContainer>
  );
}

export default HistoryRecharge;
