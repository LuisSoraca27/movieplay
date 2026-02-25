import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  User as UserComponent,
  Chip,
  Tooltip,
  Button,
  Input,
  Pagination,
  Tabs,
  Tab,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  useDisclosure
} from "@heroui/react";
import {
  setUsersAdminThunk,
  setUsersSellerThunk,
  deleteUserThunk,
  setUsersLoading,
} from "../features/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import ModalCreateUser from "../Components/ModalCreateUser";
import ModalRecharge from "../Components/ModalRecharge";
import ModalEditUser from "../Components/ModalEditUser";
import PermissionUser from "../Components/User/PermissionUser";
import ConfirmModal from "../Components/ui/ConfirmModal";
import { removeError } from "../features/error/errorSlice";
import { Search, Plus, Download, MoreVertical, RefreshCw, MessageCircle, Edit, Trash2, Key, Shield, User as UserIcon } from "lucide-react";
import * as XLSX from 'xlsx';
import { addToast } from "@heroui/toast";

import { PageContainer, PremiumHeader, PremiumCard } from "../Components/ui/PremiumComponents";

const Users = () => {
  const dispatch = useDispatch();
  const { usersAdmin, usersSeller, isLoadingUsers } = useSelector((state) => state.user);
  const { error } = useSelector((state) => state.error);
  const [reload, setReload] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  // Modals State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isRechargeOpen, setIsRechargeOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUserRecharge, setSelectedUserRecharge] = useState(null);
  const [selectedUserEdit, setSelectedUserEdit] = useState(null);
  const [selectedUserPerms, setSelectedUserPerms] = useState(null);

  // Confirm Delete State
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onOpenChange: onConfirmOpenChange } = useDisclosure();
  const [userToDelete, setUserToDelete] = useState(null);

  // Table State
  const [filterValue, setFilterValue] = useState("");
  const [selectedTab, setSelectedTab] = useState("seller");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    dispatch(setUsersLoading(true));
    Promise.all([
      dispatch(setUsersAdminThunk()),
      dispatch(setUsersSellerThunk())
    ]).finally(() => {
      dispatch(setUsersLoading(false));
    });
  }, [dispatch, reload]);

  useEffect(() => {
    if (error) {
      addToast({ title: 'Error', description: error, color: 'danger' });
      dispatch(removeError());
    }
  }, [error, dispatch]);

  // Data Filtering
  const activeUsers = useMemo(() => {
    return selectedTab === "seller" ? usersSeller : usersAdmin;
  }, [selectedTab, usersSeller, usersAdmin]);

  const filteredItems = useMemo(() => {
    let filteredUsers = [...activeUsers];

    if (filterValue) {
      filteredUsers = filteredUsers.filter((u) =>
        u.username.toLowerCase().includes(filterValue.toLowerCase()) ||
        u.email.toLowerCase().includes(filterValue.toLowerCase()) ||
        (u.phone && u.phone.toString().includes(filterValue))
      );
    }
    return filteredUsers;
  }, [activeUsers, filterValue]);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems]);

  const skeletonPlaceholders = useMemo(
    () => Array.from({ length: 10 }, (_, i) => ({ __skeleton: true, id: `skeleton-${i}` })),
    []
  );

  const tableItems = isLoadingUsers ? skeletonPlaceholders : items;

  const pages = Math.ceil(filteredItems.length / rowsPerPage);

  // Handlers
  const handleReload = () => setReload(!reload);

  const handleCreateOpen = () => setIsCreateOpen(true);
  const handleCreateClose = () => {
    setIsCreateOpen(false);
    handleReload();
  };

  const handleRecharge = (user) => {
    setSelectedUserRecharge(user);
    setIsRechargeOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUserEdit(user);
    setIsEditOpen(true);
  };

  const handleDeleteClick = (userId) => {
    setUserToDelete(userId);
    onConfirmOpen();
  };

  const handleConfirmDelete = () => {
    if (userToDelete) {
      dispatch(deleteUserThunk(userToDelete))
        .then(() => {
          addToast({ title: 'Éxito', description: "Usuario eliminado correctamente", color: 'success' });
          handleReload();
        })
        .catch(() => addToast({ title: 'Error', description: "Error al eliminar usuario", color: 'danger' }))
        .finally(() => {
          onConfirmOpenChange(false);
          setUserToDelete(null);
        });
    }
  };

  const exportToExcel = () => {
    const dataToExport = filteredItems;

    if (!dataToExport.length) {
      addToast({
        title: "Sin datos para exportar",
        description: "No hay usuarios en el listado actual.",
        color: "warning",
      });
      return;
    }

    const exportData = dataToExport.map((u) => ({
      Usuario: u.username,
      Email: u.email,
      Teléfono: u.phone || "",
      Rol: u.role,
      País: u.country,
      Estado: u.status === "active" ? "Activo" : "Inactivo",
      Saldo: u.balance ?? 0,
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Usuarios");

    const date = new Date().toISOString().slice(0, 10);
    const filename = `usuarios-${selectedTab}-${date}.xlsx`;
    XLSX.writeFile(workbook, filename);

    addToast({
      title: "Exportación completada",
      description: `Se exportaron ${exportData.length} usuarios a ${filename}`,
      color: "success",
    });
  };

  // refresh permissions logic
  const refreshUserPermissions = async (userId) => {
    // Implement logic if permissions logic is strictly needed here or if PermissionUser handles it self-contained
    // The original code had logic here, let's keep basic reload or specialized fetch if needed.
    // For now, simpler is creating a callback.
    try {
      const dksoluciones = (await import("../api/config")).default;
      const getConfig = (await import("../utils/config")).default;
      const response = await dksoluciones.get(`user/permissions/${userId}`, getConfig());
      if (response.data?.status === "success") {
        setSelectedUserPerms(prev => ({ ...prev, Permissions: response.data.data.permissions }));
      }
    } catch (err) {
      console.error(err);
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
      case "username":
        return (
          <UserComponent
            avatarProps={{ radius: "lg", src: user.avatar, className: "w-10 h-10" }}
            description={
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                {user.email}
              </span>
            }
            name={
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                {cellValue}
              </span>
            }
          >
            {user.email}
          </UserComponent>
        );
      case "role":
        return (
          <div className="flex flex-col">
            <p className="text-sm font-bold text-slate-900 capitalize">{cellValue}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{user.country}</p>
          </div>
        );
      case "status":
        return (
          <Chip
            className="capitalize border-none gap-1 px-1 h-7"
            color={user.status === "active" ? "success" : "danger"}
            size="sm"
            variant="flat"
            classNames={{
              content: "font-bold text-[10px] uppercase tracking-wider text-inherit"
            }}
          >
            {cellValue === "active" ? "Activo" : "Inactivo"}
          </Chip>
        );
      case "balance":
        return (
          <div className="font-black text-slate-900 text-base tracking-tight">
            {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(cellValue || 0)}
          </div>
        );
      case "actions":
        return (
          <div className="relative flex items-center justify-end gap-2">
            {/* Seller Actions */}
            {selectedTab === "seller" && (
              <>
                <Tooltip content="Recargar Saldo" className="bg-slate-900 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg">
                  <span className="text-lg text-emerald-600 hover:text-emerald-700 cursor-pointer active:opacity-50 transition-colors bg-emerald-50 p-2 rounded-xl" onClick={() => handleRecharge(user)}>
                    <RefreshCw size={18} />
                  </span>
                </Tooltip>
                <Tooltip content="Contactar WhatsApp" className="bg-slate-900 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg">
                  <a href={`http://wa.me/${user.phone}`} target="_blank" rel="noreferrer" className="text-lg text-emerald-600 hover:text-emerald-700 cursor-pointer active:opacity-50 transition-colors bg-emerald-50 p-2 rounded-xl">
                    <MessageCircle size={18} />
                  </a>
                </Tooltip>
              </>
            )}

            {/* Admin Permissions Action */}
            {selectedTab === "admin" && (
              <Tooltip content="Gestionar Permisos" className="bg-slate-900 text-white font-bold text-[10px] tracking-wider uppercase rounded-lg">
                <span className="text-lg text-indigo-600 hover:text-indigo-700 cursor-pointer active:opacity-50 transition-colors bg-indigo-50 p-2 rounded-xl" onClick={() => setSelectedUserPerms(user)}>
                  <Key size={18} />
                </span>
              </Tooltip>
            )}

            {/* General Actions Dropdown */}
            <Dropdown>
              <DropdownTrigger>
                <Button isIconOnly size="sm" variant="light" className="text-slate-400 hover:text-slate-600">
                  <MoreVertical size={20} />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Acciones de usuario" className="rounded-xl">
                <DropdownItem
                  key="edit"
                  startContent={<Edit size={16} />}
                  onPress={() => handleEdit(user)}
                  className="font-semibold text-slate-700"
                >
                  Editar
                </DropdownItem>
                <DropdownItem
                  key="delete"
                  startContent={<Trash2 size={16} />}
                  className="text-danger font-semibold"
                  color="danger"
                  onPress={() => handleDeleteClick(user.id)}
                >
                  Eliminar
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        );
      default:
        return cellValue;
    }
  }, [selectedTab]);

  return (
    <PageContainer>
      {/* Modals */}
      <ModalCreateUser open={isCreateOpen} onClose={handleCreateClose} />
      <ModalRecharge open={isRechargeOpen} onClose={() => setIsRechargeOpen(false)} userData={selectedUserRecharge} />
      <ModalEditUser open={isEditOpen} onClose={() => setIsEditOpen(false)} recharge={handleReload} data={selectedUserEdit} />
      {selectedUserPerms && (
        <PermissionUser
          visible={!!selectedUserPerms}
          onClose={() => setSelectedUserPerms(null)}
          permissions={selectedUserPerms.Permissions || []}
          id={selectedUserPerms.id}
          onPermissionChange={() => refreshUserPermissions(selectedUserPerms.id)}
        />
      )}
      <ConfirmModal
        isOpen={isConfirmOpen}
        onClose={() => onConfirmOpenChange(false)}
        onConfirm={handleConfirmDelete}
        title="Eliminar Usuario"
        message="¿Está seguro que desea eliminar este usuario? Esta acción no se puede deshacer."
        confirmColor="danger"
      />

      <PremiumHeader
        title="Gestión de Usuarios"
        description="Administra el acceso y roles de tu equipo"
        icon={UserIcon}
        action={
          <Button
            onPress={handleCreateOpen}
            className="bg-slate-900 text-white font-bold uppercase tracking-wider text-[11px] h-12 rounded-xl shadow-lg hover:bg-slate-800 hover:scale-105 transition-all"
            startContent={<Plus size={18} />}
          >
            Crear Usuario
          </Button>
        }
      />

      <PremiumCard>
        {/* Controls */}
        <div className="flex flex-col xl:flex-row justify-between w-full gap-8 mb-10 items-center">
          <Tabs
            aria-label="Tipos de usuario"
            selectedKey={selectedTab}
            onSelectionChange={setSelectedTab}
            radius="full"
            variant="light"
            classNames={{
              tabList: "gap-4 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl w-fit shadow-inner",
              cursor: "bg-slate-900 shadow-xl border border-slate-800",
              tab: "h-10 px-6",
              tabContent: "font-bold uppercase text-[10px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-400 transition-colors"
            }}
          >
            <Tab key="seller" title={
              <div className="flex items-center gap-2">
                <span>Vendedores</span>
                <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${selectedTab === 'seller' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {usersSeller.length}
                </span>
              </div>
            } />
            {user?.role === 'superadmin' && (
              <Tab key="admin" title={
                <div className="flex items-center gap-2">
                  <span>Admin</span>
                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${selectedTab === 'admin' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-500'}`}>
                    {usersAdmin.length}
                  </span>
                </div>
              } />
            )}
          </Tabs>

          <div className="flex gap-4 w-full md:w-auto flex-1 justify-end items-center">
            <Input
              isClearable
              placeholder="BUSCAR USUARIO..."
              size="lg"
              variant="underlined"
              startContent={<Search className="text-slate-400 mb-0.5" size={20} />}
              value={filterValue}
              onClear={() => setFilterValue("")}
              onValueChange={setFilterValue}
              classNames={{
                base: "w-full md:max-w-xs",
                input: "text-base font-bold text-slate-900",
                inputWrapper: "border-slate-200 h-12",
                innerWrapper: "pb-1"
              }}
            />
            <Button
              isIconOnly
              variant="light"
              onPress={exportToExcel}
              className="text-slate-400 hover:text-slate-900 transition-colors"
            >
              <Download size={24} />
            </Button>
          </div>
        </div>

        {/* Table */}
        <Table
          aria-label="Tabla de usuarios"
          removeWrapper
          bottomContent={
            <div className="flex w-full justify-center mt-8">
              <Pagination
                isCompact
                showShadow
                color="primary"
                page={page}
                total={pages}
                onChange={(page) => setPage(page)}
                classNames={{
                  wrapper: "gap-2 overflow-visible h-8 rounded-full border border-slate-200 shadow-sm bg-white",
                  item: "w-8 h-8 text-[10px] font-bold bg-transparent text-slate-500 data-[hover=true]:bg-slate-50",
                  cursor: "bg-slate-900 shadow-lg font-bold text-white",
                }}
              />
            </div>
          }
        >
          <TableHeader>
            <TableColumn key="username" className="bg-transparent text-slate-400 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100">USUARIO</TableColumn>
            <TableColumn key="role" className="bg-transparent text-slate-400 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100">PAÍS / ROL</TableColumn>
            <TableColumn key="balance" className="bg-transparent text-slate-400 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100">SALDO</TableColumn>
            <TableColumn key="status" className="bg-transparent text-slate-400 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100">ESTADO</TableColumn>
            <TableColumn key="actions" align="end" className="bg-transparent text-slate-400 font-bold uppercase tracking-wider text-[10px] h-12 border-b border-slate-100">ACCIONES</TableColumn>
          </TableHeader>
          <TableBody
            items={tableItems}
            emptyContent={
              <div className="py-20 text-center">
                <UserIcon size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No se encontraron usuarios</p>
              </div>
            }
          >
            {(item) => (
              <TableRow key={item.id} className="group hover:bg-slate-50/50 transition-colors border-b border-slate-50 last:border-0">
                {(columnKey) => <TableCell className="py-4">{renderCell(item, columnKey)}</TableCell>}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </PremiumCard>
    </PageContainer>
  );
};

export default Users;
