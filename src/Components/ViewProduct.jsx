/* eslint-disable react/prop-types */
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  Table, TableHeader, TableColumn, TableBody, TableRow, TableCell,
  Button, Input, Select, SelectItem, Chip, Pagination, Card, CardBody, CardFooter, Image, Tooltip
} from "@heroui/react";
import { useDispatch } from "react-redux";
import {
  fetchCombosByNameThunk,
  setComboThunk,
} from "../features/user/comboSlice";
import { Search, Plus, Upload, Pencil, Trash2, Copy } from "lucide-react";
import { addToast } from "@heroui/toast";
import { PremiumCard } from "./ui/PremiumComponents";

const ViewProduct = ({
  products,
  optionsCategory,
  handleCategory,
  category,
  handleDelete,
  setShow,
  handleEdit,
  isEdit,
  seeEmail,
  handleExcel,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const dispatch = useDispatch();

  const isCombo = (id) => id && id.toLowerCase().startsWith("combo");

  // Effect for backend search if combo
  useEffect(() => {
    if (products?.length > 0 && isCombo(products[0]?.id) && searchTerm.trim()) {
      dispatch(fetchCombosByNameThunk({ name: searchTerm }));
    } else {
      if (!isCombo(products?.[0]?.id)) {
        dispatch(setComboThunk());
      }
    }
  }, [searchTerm, dispatch, products]);

  // Local filtering for Table View (non-combo)
  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (products.length > 0 && isCombo(products[0].id)) return products;

    return products.filter(product =>
      Object.values(product).some(val =>
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [products, searchTerm]);

  // Pagination for Table View
  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredProducts.slice(start, end);
  }, [page, filteredProducts]);

  const totalPages = Math.ceil(filteredProducts.length / rowsPerPage);

  // Build columns dynamically based on seeEmail
  const columns = useMemo(() => {
    const baseCols = [
      { key: "name", label: "NOMBRE" },
      { key: "price", label: "PRECIO" },
    ];

    if (seeEmail) {
      baseCols.push(
        { key: "emailAccount", label: "CORREO" },
        { key: "passwordAccount", label: "CONTRASEÑA" },
        { key: "durationOfService", label: "DÍAS SERVICIO" }
      );
    }

    baseCols.push(
      { key: "createdAt", label: "FECHA CREACIÓN" },
      { key: "actions", label: "ACCIONES" }
    );

    return baseCols;
  }, [seeEmail]);

  const handleCopy = useCallback((item) => {
    const textToCopy = `Nombre: ${item.name}\nPrecio: ${item.price}${seeEmail ? `\nEmail: ${item.emailAccount}\nContraseña: ${item.passwordAccount}` : ''}`;
    navigator.clipboard.writeText(textToCopy);
    addToast({ title: "Copiado", description: "Copiado al portapapeles", color: "success" });
  }, [seeEmail]);

  const renderCell = useCallback((item, columnKey) => {
    switch (columnKey) {
      case "name":
        return <span className="font-bold text-slate-800">{item.name}</span>;
      case "price":
        return <span className="text-emerald-600 font-bold">{new Intl.NumberFormat("co-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(item.price)}</span>;
      case "emailAccount":
        return <span className="text-slate-600">{item.emailAccount || '-'}</span>;
      case "passwordAccount":
        return <span className="font-mono text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{item.passwordAccount || '******'}</span>;
      case "durationOfService":
        return <span className="text-slate-500 font-medium">{item.durationOfService || '-'}</span>;
      case "createdAt":
        return <span className="text-[10px] uppercase font-bold text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</span>;
      case "actions":
        return (
          <div className="flex items-center justify-center gap-2">
            <Tooltip content="Copiar">
              <Button isIconOnly size="sm" variant="light" className="text-blue-500" onPress={() => handleCopy(item)}>
                <Copy size={16} />
              </Button>
            </Tooltip>
            {isEdit && (
              <Tooltip content="Editar">
                <Button isIconOnly size="sm" variant="light" className="text-slate-600" onPress={() => handleEdit(item)}>
                  <Pencil size={16} />
                </Button>
              </Tooltip>
            )}
            <Tooltip content="Eliminar" color="danger">
              <Button isIconOnly size="sm" variant="light" color="danger" onPress={() => handleDelete(item.id)}>
                <Trash2 size={16} />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return item[columnKey];
    }
  }, [handleCopy, handleDelete, handleEdit, isEdit]);

  const renderComboView = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
      {products.map((product) => (
        <PremiumCard key={product.id} className="w-full p-4 hover:scale-[1.02] transition-transform duration-300 !rounded-[2.5rem]">
          <div className="relative mb-4 group cursor-pointer" onClick={() => handleEdit(product)}>
            <div className="overflow-hidden rounded-[2rem] shadow-sm">
              <Image
                shadow="none"
                radius="none"
                width="100%"
                alt={product.name}
                className="w-full object-cover h-[200px] hover:scale-110 transition-transform duration-500"
                src={product.imgCombos?.[0]?.urlImagen || "/placeholder.jpg"}
              />
            </div>
            <div className="absolute top-3 right-3">
              {product.hasMatchingProfiles ? (
                <Chip size="sm" classNames={{ base: "bg-emerald-500 text-white font-bold uppercase text-[10px] tracking-wider border-none shadow-lg" }}>Disponible</Chip>
              ) : (
                <Chip size="sm" classNames={{ base: "bg-rose-500 text-white font-bold uppercase text-[10px] tracking-wider border-none shadow-lg" }}>Agotado</Chip>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-start">
              <b className="truncate text-slate-900 text-lg font-bold tracking-tight">{product.name}</b>
            </div>

            <p className="text-slate-400 text-xs font-medium line-clamp-2 min-h-[2.5em]">{product.description}</p>

            <div className="flex justify-between items-end mt-2 pt-4 border-t border-slate-100">
              <div className="flex flex-col">
                {product.offerPrice && product.offerPrice !== 0 && (
                  <span className="text-[10px] text-slate-400 font-bold line-through ml-1">
                    {new Intl.NumberFormat("co-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(product.price)}
                  </span>
                )}
                <span className="text-xl font-extrabold text-emerald-600 tracking-tight">
                  {new Intl.NumberFormat("co-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(product.offerPrice || product.price)}
                </span>
              </div>

              <div className="flex gap-1">
                <Button isIconOnly size="sm" className="bg-slate-100 text-slate-600 rounded-full" onPress={() => handleEdit(product)}>
                  <Pencil size={14} />
                </Button>
                <Button isIconOnly size="sm" className="bg-rose-50 text-rose-500 rounded-full" onPress={() => handleDelete(product.id)}>
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
          </div>
        </PremiumCard>
      ))}
    </div>
  );

  const renderTableView = () => (
    <PremiumCard className="p-0 overflow-hidden">
      <Table
        aria-label="Tabla de productos"
        shadow="none"
        classNames={{
          wrapper: "shadow-none p-0",
          th: "bg-slate-50 text-slate-500 font-bold uppercase tracking-wider text-[10px] h-12",
          td: "py-4 border-b border-slate-100 last:border-0"
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
                onChange={(p) => setPage(p)}
                classNames={{
                  cursor: "bg-slate-900 shadow-lg shadow-slate-900/20"
                }}
              />
            </div>
          ) : null
        }
      >
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.key}
              align={column.key === "actions" ? "center" : "start"}
            >
              {column.label}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items} emptyContent="No se encontraron productos">
          {(item) => (
            <TableRow key={item.id}>
              {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </PremiumCard>
  );

  return (
    <div className="space-y-6">
      {/* Controls Header */}
      <PremiumCard className="p-6">
        <div className="flex flex-col md:flex-row justify-between gap-6">
          <div className="flex flex-1 gap-4">
            <Input
              label="BUSCAR"
              labelPlacement="outside"
              startContent={<Search className="text-slate-400" size={18} />}
              placeholder="Escribe para buscar..."
              value={searchTerm}
              onValueChange={setSearchTerm}
              variant="bordered"
              classNames={{
                label: "text-slate-400 font-bold tracking-wider text-[10px]",
                input: "text-slate-800 font-semibold",
                inputWrapper: "border-slate-200 h-10 bg-slate-50/50"
              }}
            />
            {seeEmail && optionsCategory && (
              <Select
                label="CATEGORÍA"
                labelPlacement="outside"
                placeholder="Seleccionar"
                className="max-w-xs"
                onChange={(e) => handleCategory(e)}
                defaultSelectedKeys={category ? [category] : undefined}
                variant="bordered"
                classNames={{
                  label: "text-slate-400 font-bold tracking-wider text-[10px]",
                  trigger: "border-slate-200 h-10 bg-slate-50/50",
                  value: "text-slate-800 font-semibold"
                }}
              >
                {optionsCategory.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.name}
                  </SelectItem>
                ))}
              </Select>
            )}
          </div>
          <div className="flex gap-3 items-end">
            <Button
              className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[10px] h-10 rounded-xl shadow-md hover:bg-slate-800"
              onPress={setShow}
              startContent={<Plus size={16} />}
            >
              CREAR PRODUCTO
            </Button>
            {seeEmail && handleExcel && (
              <Button
                className="bg-white text-slate-700 border border-slate-200 font-bold uppercase tracking-wider text-[10px] h-10 rounded-xl hover:bg-slate-50"
                onPress={handleExcel}
                startContent={<Upload size={16} />}
              >
                SUBIR EXCEL
              </Button>
            )}
          </div>
        </div>
      </PremiumCard>

      {/* Content */}
      {products?.length > 0 && isCombo(products[0].id) ? renderComboView() : renderTableView()}

    </div>
  );
};

export default ViewProduct;
