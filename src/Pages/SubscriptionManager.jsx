import { useState, useEffect, useCallback } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Chip,
  useDisclosure,
} from "@heroui/react";
import {
  CreditCard,
  RefreshCw,
  Pause,
  Play,
  Plus,
  Minus,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import {
  PageContainer,
  PremiumHeader,
  PremiumCard,
} from "../Components/ui/PremiumComponents";
import dksoluciones from "../api/config";

const STATUS_CONFIG = {
  active: { label: "Activa", color: "success", icon: CheckCircle },
  expired: { label: "Vencida", color: "danger", icon: XCircle },
  suspended: { label: "Suspendida", color: "warning", icon: AlertTriangle },
};

const SubscriptionManager = () => {
  const [subscription, setSubscription] = useState(null);
  const [loading, setLoading] = useState(true);
  const [days, setDays] = useState("30");
  const [removeDays, setRemoveDays] = useState("1");
  const [createDays, setCreateDays] = useState("30");
  const [actionLoading, setActionLoading] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    isOpen: isRemoveOpen,
    onOpen: onRemoveOpen,
    onOpenChange: onRemoveOpenChange,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onOpenChange: onCreateOpenChange,
  } = useDisclosure();

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      const res = await dksoluciones.get("subscription");
      const subs = res.data.data.subscriptions;
      setSubscription(subs.length > 0 ? subs[0] : null);
    } catch (error) {
      console.error("Error cargando suscripción:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  const handleRenew = async (onClose) => {
    if (!subscription) return;
    const parsedDays = parseInt(days);
    if (!parsedDays || parsedDays < 1) return;
    setActionLoading(true);
    try {
      await dksoluciones.patch(`subscription/renew/${subscription.id}`, {
        days: parsedDays,
      });
      await fetchSubscription();
      onClose();
    } catch (error) {
      console.error("Error renovando:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveDays = async (onClose) => {
    if (!subscription) return;
    const parsedDays = parseInt(removeDays);
    if (!parsedDays || parsedDays < 1) return;
    setActionLoading(true);
    try {
      await dksoluciones.patch(`subscription/remove-days/${subscription.id}`, {
        days: parsedDays,
      });
      await fetchSubscription();
      onClose();
    } catch (error) {
      console.error("Error quitando días:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleSuspend = async () => {
    if (!subscription) return;
    try {
      await dksoluciones.patch(`subscription/suspend/${subscription.id}`);
      await fetchSubscription();
    } catch (error) {
      console.error("Error suspendiendo:", error);
    }
  };

  const handleActivate = async () => {
    if (!subscription) return;
    try {
      await dksoluciones.patch(`subscription/activate/${subscription.id}`);
      await fetchSubscription();
    } catch (error) {
      console.error("Error activando:", error);
    }
  };

  const handleCreate = async (onClose) => {
    const parsedDays = parseInt(createDays);
    if (!parsedDays || parsedDays < 1) return;
    setActionLoading(true);
    try {
      await dksoluciones.post("subscription/create", {
        plan: "standard",
        days: parsedDays,
      });
      await fetchSubscription();
      onClose();
    } catch (error) {
      console.error("Error creando suscripción:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const openRenewModal = () => {
    setDays("30");
    onOpen();
  };

  const openRemoveModal = () => {
    setRemoveDays("1");
    onRemoveOpen();
  };

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const getDaysRemaining = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const config = subscription
    ? STATUS_CONFIG[subscription.status] || STATUS_CONFIG.expired
    : null;

  const daysRemaining = subscription ? getDaysRemaining(subscription.endDate) : 0;

  return (
    <PageContainer>
      <PremiumHeader
        title="Suscripción"
        description="Gestión de la suscripción de la tienda"
        icon={CreditCard}
        action={
          !subscription && (
            <Button
              color="primary"
              startContent={<Plus size={16} />}
              className="font-bold"
              onPress={onCreateOpen}
            >
              Crear Suscripción
            </Button>
          )
        }
      />

      {loading ? (
        <PremiumCard>
          <div className="text-center py-12 text-slate-400">Cargando...</div>
        </PremiumCard>
      ) : !subscription ? (
        <PremiumCard>
          <div className="text-center py-16">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">
              No hay suscripción registrada. Crea una para comenzar.
            </p>
          </div>
        </PremiumCard>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <PremiumCard>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${config.color === "success" ? "bg-green-50" : config.color === "danger" ? "bg-red-50" : "bg-amber-50"}`}>
                  <config.icon size={24} className={config.color === "success" ? "text-green-500" : config.color === "danger" ? "text-red-500" : "text-amber-500"} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Estado
                  </p>
                  <Chip size="sm" color={config.color} variant="flat" className="mt-1">
                    {config.label}
                  </Chip>
                </div>
              </div>
            </PremiumCard>
            <PremiumCard>
              <div className="flex items-center gap-3">
                <div className="bg-blue-50 p-3 rounded-xl">
                  <Calendar size={24} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Vencimiento
                  </p>
                  <p className="text-sm font-extrabold text-slate-900 mt-1">
                    {formatDate(subscription.endDate)}
                  </p>
                </div>
              </div>
            </PremiumCard>
            <PremiumCard>
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-xl ${daysRemaining > 7 ? "bg-green-50" : daysRemaining > 0 ? "bg-amber-50" : "bg-red-50"}`}>
                  <CreditCard size={24} className={daysRemaining > 7 ? "text-green-500" : daysRemaining > 0 ? "text-amber-500" : "text-red-500"} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Días Restantes
                  </p>
                  <p className={`text-2xl font-extrabold mt-1 ${daysRemaining > 7 ? "text-green-600" : daysRemaining > 0 ? "text-amber-600" : "text-red-600"}`}>
                    {daysRemaining > 0 ? daysRemaining : 0}
                  </p>
                </div>
              </div>
            </PremiumCard>
          </div>

          <PremiumCard>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400 mb-1">
                  Detalles
                </p>
                <h3 className="text-lg font-extrabold text-slate-900">
                  Plan {subscription.plan}
                </h3>
                <p className="text-sm text-slate-500 mt-1">
                  Inicio: {formatDate(subscription.startDate)} — Vence: {formatDate(subscription.endDate)}
                </p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button
                  color="primary"
                  variant="flat"
                  startContent={<RefreshCw size={14} />}
                  onPress={openRenewModal}
                  className="font-bold"
                >
                  Añadir Días
                </Button>
                <Button
                  color="danger"
                  variant="flat"
                  startContent={<Minus size={14} />}
                  onPress={openRemoveModal}
                  className="font-bold"
                >
                  Quitar Días
                </Button>
                {subscription.status === "active" ? (
                  <Button
                    color="warning"
                    variant="flat"
                    startContent={<Pause size={14} />}
                    onPress={handleSuspend}
                    className="font-bold"
                  >
                    Suspender
                  </Button>
                ) : (
                  <Button
                    color="success"
                    variant="flat"
                    startContent={<Play size={14} />}
                    onPress={handleActivate}
                    className="font-bold"
                  >
                    Activar
                  </Button>
                )}
              </div>
            </div>
          </PremiumCard>
        </>
      )}

      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-extrabold">
                Añadir Días a la Suscripción
              </ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Cantidad de días"
                  placeholder="Ej: 30"
                  min={1}
                  value={days}
                  onValueChange={setDays}
                />
                {subscription && parseInt(days) > 0 && (
                  <div className="bg-blue-50 rounded-xl p-4 mt-2">
                    <p className="text-xs text-blue-600 font-bold">
                      Nuevo vencimiento:{" "}
                      {(() => {
                        const now = new Date();
                        const currentEnd = new Date(subscription.endDate);
                        const base = currentEnd > now ? currentEnd : now;
                        const newEnd = new Date(base);
                        newEnd.setDate(newEnd.getDate() + parseInt(days));
                        return formatDate(newEnd);
                      })()}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  className="font-bold"
                  isLoading={actionLoading}
                  isDisabled={!parseInt(days) || parseInt(days) < 1}
                  onPress={() => handleRenew(onClose)}
                >
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal isOpen={isRemoveOpen} onOpenChange={onRemoveOpenChange} placement="center">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-extrabold">
                Quitar Días de la Suscripción
              </ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Cantidad de días a quitar"
                  placeholder="Ej: 5"
                  min={1}
                  value={removeDays}
                  onValueChange={setRemoveDays}
                />
                {subscription && parseInt(removeDays) > 0 && (
                  <div className="bg-red-50 rounded-xl p-4 mt-2">
                    <p className="text-xs text-red-600 font-bold">
                      Nuevo vencimiento:{" "}
                      {(() => {
                        const newEnd = new Date(subscription.endDate);
                        newEnd.setDate(newEnd.getDate() - parseInt(removeDays));
                        return formatDate(newEnd);
                      })()}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="danger"
                  className="font-bold"
                  isLoading={actionLoading}
                  isDisabled={!parseInt(removeDays) || parseInt(removeDays) < 1}
                  onPress={() => handleRemoveDays(onClose)}
                >
                  Confirmar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal
        isOpen={isCreateOpen}
        onOpenChange={onCreateOpenChange}
        placement="center"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="font-extrabold">
                Crear Suscripción
              </ModalHeader>
              <ModalBody>
                <Input
                  type="number"
                  label="Cantidad de días"
                  placeholder="Ej: 30"
                  min={1}
                  value={createDays}
                  onValueChange={setCreateDays}
                />
                {parseInt(createDays) > 0 && (
                  <div className="bg-green-50 rounded-xl p-4 mt-2">
                    <p className="text-xs text-green-600 font-bold">
                      Vencimiento:{" "}
                      {(() => {
                        const end = new Date();
                        end.setDate(end.getDate() + parseInt(createDays));
                        return formatDate(end);
                      })()}
                    </p>
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button variant="flat" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  color="primary"
                  className="font-bold"
                  isLoading={actionLoading}
                  isDisabled={!parseInt(createDays) || parseInt(createDays) < 1}
                  onPress={() => handleCreate(onClose)}
                >
                  Crear Suscripción
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </PageContainer>
  );
};

export default SubscriptionManager;
