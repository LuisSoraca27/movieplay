import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  editUserThunk,
  getHistoryRecharge,
  getUserSession,
} from "../../features/user/userSlice";
import { setBalanceThunk } from "../../features/balance/balanceSlice";
import { useForm } from "react-hook-form";
import { addToast } from "@heroui/toast";
import {
  Card,
  CardHeader,
  CardBody,
  Button,
  Input,
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Chip,
  Avatar,
  Tab,
  Tabs,
  Divider,
  Spinner,
} from "@heroui/react";
import { removeError, removeSuccess } from "../../features/error/errorSlice";
import {
  User,
  Mail,
  Phone,
  Lock,
  Save,
  X,
  CreditCard,
  History,
  Pencil,
  Wallet,
  Shield,
  Check,
  Plus
} from "lucide-react";

const MyProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { userSession, historyRecharge } = useSelector((state) => state.user);
  const balance = useSelector((state) => state.balance);
  const { error, success } = useSelector((state) => state.error);
  const user = JSON.parse(localStorage.getItem("user"));

  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState("info");

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    dispatch(getUserSession());
    if (user?.id) {
      dispatch(getHistoryRecharge(user.id));
      dispatch(setBalanceThunk(user.id));
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    if (userSession) {
      reset({
        username: userSession.username || "",
        email: userSession.email || "",
        phone: userSession.phone || "",
      });
    }
  }, [userSession, reset]);

  useEffect(() => {
    if (error) {
      addToast({
        title: "Error",
        description: error,
        color: "danger",
      });
      dispatch(removeError());
    }
    if (success) {
      addToast({
        title: "Éxito",
        description: success,
        color: "success",
      });
      dispatch(removeSuccess());
    }
  }, [error, success, dispatch]);

  const onSubmit = (formData) => {
    setLoading(true);
    dispatch(editUserThunk(formData, userSession.id)).then((res) => {
      setLoading(false);
      if (!res.error) {
        setIsEditing(false);
        dispatch(getUserSession());
      }
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "No Completado":
        return "danger";
      case "En proceso":
        return "warning";
      case "Completado":
        return "success";
      default:
        return "default";
    }
  };

  const columns = [
    { name: "ID", uid: "numberOrder" },
    { name: "MONTO", uid: "balance" },
    { name: "ESTADO", uid: "status" },
    { name: "FECHA", uid: "createdAt" },
  ];

  const stats = [
    {
      label: "Saldo Actual",
      value: `$${new Intl.NumberFormat().format(balance)}`,
      icon: Wallet,
      color: "success",
    },
    {
      label: "Total Recargas",
      value: historyRecharge?.length || 0,
      icon: CreditCard,
      color: "primary",
    },
    {
      label: "Estado",
      value: "Verificado",
      icon: Shield,
      color: "secondary",
    },
  ];

  if (!userSession) {
    return (
      <div className="min-h-screen bg-[#F1F1F2] flex items-center justify-center">
        <Spinner size="lg" label="Preparando tu perfil..." color="primary" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in relative overflow-hidden pt-4 md:pt-8 pb-12">
      {/* Background Accents (Subtle Light) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-blue-100/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 -left-24 w-[600px] h-[600px] bg-indigo-100/5 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-8 border-b border-slate-300">
          <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full blur opacity-10 group-hover:opacity-20 transition duration-1000 group-hover:duration-200" />
              <Avatar
                src={userSession?.photoUrl}
                icon={<User className="w-12 h-12" />}
                className="w-32 h-32 border-4 border-white relative shadow-xl"
              />
              <div className="absolute bottom-2 right-2 bg-emerald-500 w-6 h-6 rounded-full border-4 border-white flex items-center justify-center">
                <Check size={12} className="text-white" />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
                  Hola, <span className="text-blue-600 italic">{userSession?.username || "Usuario"}</span>
                </h1>
                <p className="text-slate-600 font-bold uppercase tracking-wider text-[10px] mt-2">
                  {userSession?.email || "correo@ejemplo.com"} • Miembro desde {new Date(userSession?.createdAt).toLocaleDateString("es-ES", { year: 'numeric', month: 'long' })}
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Chip
                  variant="flat"
                  className="bg-slate-100 text-slate-600 border border-slate-200 font-bold uppercase tracking-widest text-[10px] h-7"
                  startContent={<Shield size={12} />}
                >
                  {userSession?.role === 'seller' ? 'Vendedor Verificado' : 'Usuario Plata'}
                </Chip>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center md:items-end gap-4">
            <div className="text-right">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider mb-1">Saldo Disponible</p>
              <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
                ${new Intl.NumberFormat().format(balance)}
              </h2>
            </div>

            <Button
              as="a"
              href={`https://wa.me/3014651579?text=Hola%2C%20me%20gustar%C3%ADa%20recargar%20saldo%2C%20mi%20correo%20es%3A%20${userSession?.email || ''}`}
              target="_blank"
              size="lg"
              className="bg-slate-900 text-white font-black uppercase tracking-widest text-xs px-8 h-14 rounded-2xl hover:bg-slate-800 transition-all hover:scale-[1.02] shadow-xl shadow-slate-900/10"
              startContent={<Plus size={18} strokeWidth={3} />}
            >
              Recargar Ahora
            </Button>
          </div>
        </section>

        {/* Navigation & Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="flex flex-col gap-2">
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider pl-4 mb-2">Menú de Usuario</p>
              <button
                onClick={() => setSelectedTab("info")}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${selectedTab === "info"
                  ? "bg-white text-slate-900 font-bold shadow-md shadow-slate-300/20 ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
                  }`}
              >
                <User size={20} />
                <span className="text-sm uppercase tracking-wide">Perfil</span>
              </button>
              <button
                onClick={() => setSelectedTab("history")}
                className={`flex items-center gap-4 px-6 py-4 rounded-xl transition-all duration-300 ${selectedTab === "history"
                  ? "bg-white text-slate-900 font-bold shadow-md shadow-slate-300/20 ring-1 ring-slate-200"
                  : "text-slate-500 hover:text-slate-900 hover:bg-white/40"
                  }`}
              >
                <History size={20} />
                <span className="text-sm uppercase tracking-wide">Historial</span>
              </button>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-9 animate-fade-in">
            {selectedTab === "info" && (
              <div className="bg-white border border-slate-200 rounded-[2rem] p-8 md:p-12 shadow-sm">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
                  <div>
                    <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Datos Personales</h2>
                    <p className="text-slate-500 text-sm font-semibold">Mantén tu información actualizada.</p>
                  </div>
                  {!isEditing && (
                    <Button
                      onPress={() => setIsEditing(true)}
                      className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-bold uppercase tracking-wider text-[10px] h-10 px-6 rounded-lg"
                      startContent={<Pencil size={14} />}
                    >
                      Editar Perfil
                    </Button>
                  )}
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-10">
                    <Input
                      label="NOMBRE DE USUARIO"
                      labelPlacement="outside"
                      placeholder="Tu nombre"
                      variant="underlined"
                      {...register("username", { required: "Requerido" })}
                      isInvalid={!!errors.username}
                      errorMessage={errors.username?.message}
                      isReadOnly={!isEditing}
                      classNames={{
                        label: "text-slate-400 font-bold tracking-wider text-[10px]",
                        input: "text-slate-800 font-semibold text-lg",
                        inputWrapper: "border-slate-200 h-14"
                      }}
                    />

                    <Input
                      label="CORREO ELECTRÓNICO"
                      labelPlacement="outside"
                      placeholder="Tu correo"
                      type="email"
                      variant="underlined"
                      {...register("email", { required: "Requerido" })}
                      isInvalid={!!errors.email}
                      errorMessage={errors.email?.message}
                      isReadOnly={!isEditing}
                      classNames={{
                        label: "text-slate-400 font-bold tracking-wider text-[10px]",
                        input: "text-slate-800 font-semibold text-lg",
                        inputWrapper: "border-slate-200 h-14"
                      }}
                    />

                    <Input
                      label="TELÉFONO DE CONTACTO"
                      labelPlacement="outside"
                      placeholder="Tu teléfono"
                      type="tel"
                      variant="underlined"
                      {...register("phone", { required: "Requerido" })}
                      isInvalid={!!errors.phone}
                      errorMessage={errors.phone?.message}
                      isReadOnly={!isEditing}
                      classNames={{
                        label: "text-slate-400 font-bold tracking-wider text-[10px]",
                        input: "text-slate-800 font-semibold text-lg",
                        inputWrapper: "border-slate-200 h-14"
                      }}
                    />

                    <Input
                      label="ROL EN LA PLATAFORMA"
                      labelPlacement="outside"
                      value={userSession?.role === 'seller' ? 'VENDEDOR' : 'COMPRADOR'}
                      isReadOnly
                      variant="underlined"
                      classNames={{
                        label: "text-slate-400 font-bold tracking-wider text-[10px]",
                        input: "text-blue-600 font-bold text-lg",
                        inputWrapper: "border-slate-100 opacity-60 h-14"
                      }}
                    />
                  </div>

                  {isEditing && (
                    <div className="flex justify-end gap-4 pt-8 border-t border-slate-100">
                      <Button
                        variant="light"
                        className="text-slate-400 font-black uppercase tracking-widest text-[10px] h-12 px-8"
                        onPress={() => {
                          setIsEditing(false);
                          if (userSession) {
                            reset({
                              username: userSession.username || "",
                              email: userSession.email || "",
                              phone: userSession.phone || "",
                            });
                          }
                        }}
                        isDisabled={loading}
                      >
                        Cancelar
                      </Button>
                      <Button
                        type="submit"
                        isLoading={loading}
                        className="bg-blue-600 text-white font-black uppercase tracking-widest text-[10px] h-12 px-8 rounded-xl shadow-xl shadow-blue-600/20"
                      >
                        Aplicar Cambios
                      </Button>
                    </div>
                  )}
                </form>
              </div>
            )}

            {selectedTab === "history" && (
              <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-8 md:p-12 pb-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                      <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">Historial de Recargas</h2>
                      <p className="text-slate-500 text-sm font-semibold">Visualiza tus transacciones recientes.</p>
                    </div>
                    <div className="bg-slate-50 px-4 py-2 rounded-xl border border-slate-200">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Operaciones: </span>
                      <span className="text-sm font-black text-slate-900">{historyRecharge?.length || 0}</span>
                    </div>
                  </div>
                </div>

                <div className="px-4 pb-8 md:px-8">
                  <Table
                    aria-label="Transacciones"
                    removeWrapper
                    className="p-0"
                    classNames={{
                      th: "bg-slate-50 text-slate-400 font-bold uppercase tracking-wider text-[10px] border-b border-slate-100",
                      td: "py-6 text-slate-800 font-semibold"
                    }}
                  >
                    <TableHeader columns={columns}>
                      {(column) => <TableColumn key={column.uid}>{column.name}</TableColumn>}
                    </TableHeader>
                    <TableBody
                      items={historyRecharge || []}
                      emptyContent={
                        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
                          <History size={48} className="mb-4 opacity-20" />
                          <p className="font-black uppercase tracking-[0.3em] text-xs">Sin movimientos registrados</p>
                        </div>
                      }
                      loadingContent={<Spinner color="primary" />}
                    >
                      {(item) => (
                        <TableRow key={item.id || item.numberOrder} className="border-b border-slate-50 last:border-none hover:bg-slate-50 transition-colors">
                          {(columnKey) => {
                            const cellValue = item[columnKey];
                            switch (columnKey) {
                              case "numberOrder":
                                return (
                                  <TableCell>
                                    <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
                                      #{cellValue}
                                    </span>
                                  </TableCell>
                                );
                              case "status":
                                return (
                                  <TableCell>
                                    <Chip
                                      className={`
                                        ${cellValue === 'Completado' ? 'bg-emerald-50 text-emerald-600' :
                                          cellValue === 'En proceso' ? 'bg-amber-50 text-amber-600' :
                                            'bg-rose-50 text-rose-600'}
                                        border border-current/20 font-black uppercase tracking-widest text-[9px] h-6
                                      `}
                                      variant="flat"
                                      size="sm"
                                    >
                                      {cellValue}
                                    </Chip>
                                  </TableCell>
                                );
                              case "balance":
                                return (
                                  <TableCell>
                                    <span className="text-lg font-black text-slate-900">
                                      ${Number(cellValue).toLocaleString()}
                                    </span>
                                  </TableCell>
                                );
                              case "createdAt":
                                return (
                                  <TableCell className="text-slate-400 text-[11px] font-bold uppercase">
                                    {new Date(cellValue).toLocaleDateString("es-ES", {
                                      year: "numeric",
                                      month: "short",
                                      day: "numeric",
                                    })}
                                  </TableCell>
                                );
                              default:
                                return <TableCell>{cellValue}</TableCell>;
                            }
                          }}
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
