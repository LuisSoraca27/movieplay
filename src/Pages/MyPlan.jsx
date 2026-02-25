import { Chip, Button, Card, CardBody } from "@heroui/react";
import {
  CreditCard,
  Calendar,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Clock,
  MessageCircle,
  Sparkles,
  Zap,
  RefreshCw,
  Users,
  TrendingUp,
  ShieldCheck,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import {
  PageContainer,
  PremiumHeader,
  PremiumCard,
} from "../Components/ui/PremiumComponents";

const STATUS_CONFIG = {
  active: { label: "Activa", color: "success", icon: CheckCircle },
  expired: { label: "Vencida", color: "danger", icon: XCircle },
  suspended: { label: "Suspendida", color: "warning", icon: AlertTriangle },
};

const GRACE_DAYS = 2;

const MyPlan = () => {
  const subscription = JSON.parse(localStorage.getItem("subscription") || "null");

  const formatDate = (date) =>
    new Date(date).toLocaleDateString("es-CO", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  if (!subscription) {
    return (
      <PageContainer>
        <PremiumHeader
          title="Mi Plan"
          description="Información de tu suscripción"
          icon={CreditCard}
        />
        <PremiumCard>
          <div className="text-center py-16">
            <div className="bg-slate-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard size={28} className="text-slate-400" />
            </div>
            <p className="text-slate-500 text-sm">
              No hay información de suscripción disponible.
            </p>
          </div>
        </PremiumCard>
      </PageContainer>
    );
  }

  const now = new Date();
  const endDate = new Date(subscription.endDate);
  const startDate = new Date(subscription.startDate);
  const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));

  const isExpired = daysRemaining <= 0;
  const isGrace = isExpired && subscription.status === "expired";
  const isExpiring = daysRemaining <= 7 && daysRemaining > 0;

  const graceLimit = new Date(endDate);
  graceLimit.setDate(graceLimit.getDate() + GRACE_DAYS);
  const graceDaysLeft = isGrace ? Math.max(0, Math.ceil((graceLimit - now) / (1000 * 60 * 60 * 24))) : 0;

  const config = STATUS_CONFIG[subscription.status] || STATUS_CONFIG.expired;
  const StatusIcon = config.icon;

  return (
    <PageContainer>
      {/* Header con estilo Kiosk (Borde inferior sutil) */}
      <section className="flex flex-col md:flex-row items-center justify-between gap-8 pb-6 border-b border-slate-200/60 transition-all">
        <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left transition-all">
          <div className="bg-white p-5 rounded-2xl shadow-lg ring-1 ring-slate-200/50">
            <CreditCard size={32} className="text-slate-800" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Mi Plan
            </h1>
            <p className="text-slate-400 font-bold uppercase tracking-wider text-[11px] mt-1 pl-1">
              Gestiona tu suscripción y conoce las próximas novedades
            </p>
          </div>
        </div>

        <div className="flex gap-3 transition-all shrink-0">
          <Chip
            variant="flat"
            size="lg"
            className={`font-bold uppercase tracking-[0.1em] text-[10px] h-10 px-4 border-2 ${config.color === "success" ? "bg-green-50 text-green-700 border-green-100" : config.color === "danger" ? "bg-red-50 text-red-700 border-red-100" : "bg-amber-50 text-amber-700 border-amber-100"}`}
          >
            Suscripción {config.label}
          </Chip>
        </div>
      </section>

      <div className="space-y-12">
        {/* Alertas Premium con Animación */}
        {(isGrace || isExpiring) && (
          <div className="space-y-4 animate-fade-in">
            {isGrace && (
              <div className="bg-red-50/40 backdrop-blur-md border border-red-100 rounded-[2rem] p-6 flex flex-col md:flex-row items-center gap-5 shadow-sm">
                <div className="bg-white p-4 rounded-2xl shadow-md border border-red-50">
                  <ShieldCheck size={28} className="text-red-500" />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h4 className="text-red-900 font-extrabold text-lg">Atención: Suscripción Vencida</h4>
                  <p className="text-sm text-red-700/80 font-medium">
                    Tienes <span className="text-red-600 font-black">{graceDaysLeft} día{graceDaysLeft !== 1 ? "s" : ""}</span> de gracia antes de la suspensión del servicio. Contacta soporte.
                  </p>
                </div>
                <Button className="bg-red-600 text-white font-bold h-12 px-8 rounded-xl shadow-lg hover:bg-red-700 transition-all">
                  RENOVAR AHORA
                </Button>
              </div>
            )}
          </div>
        )}

        {/* KPIs Concept: 3 Cards con mayor profundidad */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { label: "ESTADO DE CUENTA", value: config.label, icon: config.icon, color: config.color, detail: "Renovación automática: No" },
            { label: "FECHA LÍMITE", value: formatDate(subscription.endDate), icon: Calendar, color: "blue", detail: "Vence a las 23:59hs" },
            { label: "TIEMPO RESTANTE", value: `${daysRemaining > 0 ? daysRemaining : 0} Días`, icon: Clock, color: daysRemaining > 7 ? "success" : "warning", detail: "Sin interrupciones" },
          ].map((kpi, i) => (
            <Card key={i} className="bg-white border border-slate-200/60 rounded-[2.2rem] p-1 shadow-sm hover:shadow-xl transition-all hover:translate-y-[-5px] overflow-hidden group">
              <CardBody className="p-8">
                <div className="flex flex-col gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-110 duration-300 ${kpi.color === "success" ? "bg-green-50 text-green-600 shadow-green-100/50" : kpi.color === "danger" ? "bg-red-50 text-red-600 shadow-red-100/50" : kpi.color === "warning" ? "bg-amber-50 text-amber-600 shadow-amber-100/50" : "bg-blue-50 text-blue-600 shadow-blue-100/50"}`}>
                    <kpi.icon size={26} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-1">{kpi.label}</p>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">{kpi.value}</h4>
                  </div>
                  <div className="pt-2 border-t border-slate-50">
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">{kpi.detail}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Content Section: Plan Actual + Pro Plan en una sola vista */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Plan Actual */}
          <div className="lg:col-span-12 xl:col-span-7 space-y-8 animate-fade-in">
            <PremiumCard className="!p-0 border border-slate-200 shadow-xl overflow-hidden min-h-[400px]">
              <div className="h-full flex flex-col">
                <div className="bg-slate-900 p-10 text-white relative h-48 flex flex-col justify-end">
                  <div className="absolute top-8 right-8 bg-blue-500/20 w-32 h-32 rounded-full blur-[50px] pointer-events-none" />
                  <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blue-400 mb-2">Nivel de Cuenta</p>
                  <h3 className="text-4xl font-black capitalize tracking-tight">Plan {subscription.plan}</h3>
                </div>

                <div className="p-10 space-y-8 flex-1">
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Contratado el</p>
                      <p className="text-lg font-extrabold text-slate-800">{formatDate(subscription.startDate)}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Renovación</p>
                      <p className="text-lg font-extrabold text-slate-800">{formatDate(subscription.endDate)}</p>
                    </div>
                  </div>

                  <div className="pt-4 p-6 bg-slate-50 rounded-2xl border border-slate-100/50">
                    <p className="text-center text-[11px] text-slate-500 font-bold uppercase tracking-wider">
                      {daysRemaining > 0 ? `Quedan exactamente ${daysRemaining} días de servicio` : "Tu servicio ha expirado"}
                    </p>
                  </div>
                </div>
              </div>
            </PremiumCard>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="bg-emerald-50/40 border border-emerald-100 rounded-[2rem] p-8 shadow-sm group hover:scale-[1.02] transition-transform h-full">
                <CardBody className="p-0 flex flex-col justify-between h-full gap-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-emerald-50 text-emerald-600">
                        <MessageCircle size={24} />
                      </div>
                      <ArrowUpRight className="text-emerald-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-extrabold text-emerald-900 tracking-tight">Soporte Directo</h4>
                      <p className="text-sm text-emerald-800/70 font-medium leading-relaxed">
                        ¿Necesitas ampliar tu plan o realizar un ajuste masivo? Nuestro equipo de expertos está listo para ayudarte en segundos.
                      </p>
                    </div>
                  </div>
                  <Button
                    as="a"
                    href="https://wa.me/573024570425"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl tracking-wider text-[11px] uppercase"
                  >
                    HABLAR CON ASESOR
                  </Button>
                </CardBody>
              </Card>

              <Card className="bg-blue-50/40 border border-blue-100 rounded-[2rem] p-8 shadow-sm group hover:scale-[1.02] transition-transform h-full">
                <CardBody className="p-0 flex flex-col justify-between h-full gap-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="bg-white p-4 rounded-2xl shadow-md border border-blue-50 text-blue-600">
                        <Users size={24} />
                      </div>
                      <ArrowUpRight className="text-blue-300 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    </div>
                    <div className="space-y-2">
                      <h4 className="text-xl font-extrabold text-blue-900 tracking-tight">Programa de Referidos</h4>
                      <p className="text-sm text-blue-800/70 font-medium leading-relaxed">
                        Recibe un <span className="text-blue-600 font-black">50% de descuento</span> en tu suscripción mensual por cada referido que active su plan.
                      </p>
                    </div>
                  </div>
                  <Button
                    as="a"
                    href="https://wa.me/573024570425?text=Hola,%20quiero%20referir%20a%20un%20amigo"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-slate-900 text-white font-bold h-12 rounded-xl tracking-wider text-[11px] uppercase shadow-lg hover:bg-slate-800 transition-all"
                  >
                    QUIERO REFERIR
                  </Button>
                </CardBody>
              </Card>
            </div>
          </div>

          {/* Pro Plan Card - Visible al lado */}
          <div className="lg:col-span-12 xl:col-span-5 animate-fade-in">
            <Card className="bg-slate-900 border-none rounded-[3rem] p-2 shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] h-full overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 rounded-full blur-[120px] -mr-40 -mt-20 group-hover:bg-blue-600/40 transition-all duration-700 pointer-events-none" />

              <CardBody className="p-8 flex flex-col justify-between h-full bg-slate-950/20 backdrop-blur-3xl rounded-[2.8rem] relative z-20 border border-white/5">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-5xl font-black text-white tracking-tighter">Plan Pro</h3>
                    <p className="text-slate-400 font-bold uppercase tracking-[0.25em] text-[10px]">Diseñado para la escala</p>
                  </div>

                  <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
                    <p className="text-blue-400 text-[9px] font-black uppercase tracking-widest mb-1">Especialistas en SaaS</p>
                    <p className="text-white text-xs font-bold leading-relaxed">Desarrollo a la medida y 100% personalizado para tus necesidades específicas.</p>
                  </div>

                  <ul className="space-y-4 pt-1">
                    {[
                      { text: "Bot de Telegram", icon: RefreshCw },
                      { text: "Página de códigos de vinculación", icon: Layers },
                      { text: "Backup diarios", icon: ShieldCheck },
                      { text: "Atención prioritaria", icon: Zap },
                      { text: "Métricas avanzadas", icon: TrendingUp },
                      { text: "Seguimiento de subscripciones", icon: Clock },
                      { text: "Automatizaciones de flujo", icon: Zap },
                      { text: "Y mucho más...", icon: Sparkles },
                    ].map((feat, i) => (
                      <li key={i} className="flex items-center gap-4 group/li">
                        <div className="bg-emerald-500/20 p-1.5 rounded-full border border-emerald-500/30 group-hover/li:scale-125 transition-transform duration-300">
                          <feat.icon size={14} className="text-emerald-400" />
                        </div>
                        <span className="text-slate-300 font-bold text-xs tracking-wide">{feat.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-8">
                  <div className="flex items-center justify-center gap-3 text-white font-black tracking-[0.2em] uppercase text-[10px] border border-white/10 py-4 rounded-xl bg-white/5 backdrop-blur-md shadow-lg">
                    <span>PRÓXIMAMENTE</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default MyPlan;
