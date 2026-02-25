import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getDashboard,
  getSalesMonthly,
  getSalesAnual,
  getTopSellers,
  getBestSellingCategories,
  getAvailableInventory,
} from "../features/dashboard/dashboardSlice";
import {
  AreaChart,
  BarChart,
  Title as TremorTitle,
  DonutChart,
} from "@tremor/react";
import { Card, CardBody, Tabs, Tab } from "@heroui/react";
import { ShoppingCart, Home, Banknote, DollarSign, Calendar, Clock, Crown, Medal, Award, XCircle, AlertTriangle } from "lucide-react";
import { PageContainer, PremiumHeader, PremiumCard, DashboardCard } from "../Components/ui/PremiumComponents";

const Dashboard = () => {
  const [selectedView, setSelectedView] = useState("monthly");
  const user = JSON.parse(localStorage.getItem("user"));
  const subscription = JSON.parse(localStorage.getItem("subscription") || "null");

  const dispatch = useDispatch();

  const {
    ventasExternas,
    ventasInternas,
    gastos,
    ventasTotales,
    ventasMonthly,
    VentasAnuales,
    topSellers,
    bestSellingCategories,
    availableInventory,
  } = useSelector((state) => state.dashboard);

  const convertValue = (value) => {
    const valueRounded = Math.round(value / 1000) * 1000;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    }).format(valueRounded);
  };

  const isMonthly = selectedView === "monthly";

  const kpiData = [
    { title: "Ventas Externas", metric: isMonthly ? ventasExternas.monthly : ventasExternas.daily, icon: ShoppingCart, gradient: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
    { title: "Ventas Internas", metric: isMonthly ? ventasInternas.monthly : ventasInternas.daily, icon: Home, gradient: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
    { title: "Gastos", metric: isMonthly ? gastos.monthly : gastos.daily, icon: Banknote, gradient: "from-rose-500 to-rose-600", shadow: "shadow-rose-500/20" },
    { title: "Ventas Totales", metric: isMonthly ? ventasTotales.monthly : ventasTotales.daily, icon: DollarSign, gradient: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20" },
  ];

  const formatChartData = (dataArray) => {
    if (!dataArray) return [];
    return dataArray.map((value, index) => ({ day: (index + 1).toString(), "Ventas": value }));
  };

  const currentMonthData = formatChartData(ventasMonthly);

  const annualData = (VentasAnuales || []).map((value, index) => {
    const months = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
    return { month: months[index], "Ventas 2025": value };
  });

  const categoryChartData = (bestSellingCategories || []).map((item) => ({
    name: item.categoryName,
    value: item.totalSales,
  }));

  const dataFormatter = (number) =>
    new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", minimumFractionDigits: 0 }).format(number);

  // Rank icons for top 3
  const rankIcons = [Crown, Medal, Award];
  const rankColors = ["text-amber-400", "text-slate-400", "text-amber-700"];

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getSalesMonthly());
    dispatch(getSalesAnual());
    dispatch(getTopSellers());
    dispatch(getBestSellingCategories());
    dispatch(getAvailableInventory());

  }, []);

  return (
    <PageContainer>
      {/* Header Section */}
      <PremiumHeader
        title="Dashboard de Ventas"
        description="RESUMEN GENERAL DE RENDIMIENTO Y MÉTRICAS CLAVE"
        action={
          <Tabs
            aria-label="Vista temporal"
            color="primary"
            variant="light"
            radius="full"
            selectedKey={selectedView}
            onSelectionChange={setSelectedView}
            classNames={{
              tabList: "gap-4 p-1.5 bg-slate-200/40 backdrop-blur-md rounded-2xl w-fit border border-slate-200/60 shadow-inner-sm",
              cursor: "bg-slate-900 shadow-xl border border-slate-800",
              tab: "h-10 px-6",
              tabContent: "font-bold uppercase text-[11px] tracking-[0.15em] group-data-[selected=true]:text-white text-slate-500"
            }}
          >
            <Tab key="monthly" title={<div className="flex items-center space-x-2"><Calendar size={16} /><span>Vista Mensual</span></div>} />
            <Tab key="daily" title={<div className="flex items-center space-x-2"><Clock size={16} /><span>Vista Diaria</span></div>} />
          </Tabs>
        }
      />

      {/* Subscription Warning Banner - Solo cuando quedan pocos días o está en gracia */}
      {user?.role === "admin" && subscription && (() => {
        const now = new Date();
        const endDate = new Date(subscription.endDate);
        const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const isExpired = daysRemaining <= 0;
        const isGrace = isExpired && subscription.status === "expired";
        const isExpiring = daysRemaining <= 7 && daysRemaining > 0;

        if (!isGrace && !isExpiring) return null;

        const graceLimit = new Date(endDate);
        graceLimit.setDate(graceLimit.getDate() + 2);
        const graceDaysLeft = isGrace ? Math.max(0, Math.ceil((graceLimit - now) / (1000 * 60 * 60 * 24))) : 0;

        const bgColor = isGrace ? "from-red-500 to-red-600" : "from-amber-500 to-amber-600";
        const shadowColor = isGrace ? "shadow-red-500/20" : "shadow-amber-500/20";
        const StatusIcon = isGrace ? XCircle : AlertTriangle;

        return (
          <Card className={`border-none bg-gradient-to-r ${bgColor} text-white shadow-xl ${shadowColor} rounded-[2rem]`}>
            <CardBody className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white/20 rounded-xl">
                    <StatusIcon size={20} className="text-white" />
                  </div>
                  <p className="text-sm font-bold">
                    {isGrace
                      ? `Tu suscripción venció. Tienes ${graceDaysLeft} día${graceDaysLeft !== 1 ? "s" : ""} de gracia antes del bloqueo.`
                      : `Tu suscripción vence en ${daysRemaining} día${daysRemaining !== 1 ? "s" : ""}. Contacta al administrador para renovar.`
                    }
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        );
      })()}

      {/* KPI Grid - Sales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((item, index) => (
          <Card key={index} className={`overflow-visible border-none bg-gradient-to-br ${item.gradient} text-white shadow-xl ${item.shadow} hover:scale-105 hover:shadow-2xl transition-all duration-300 rounded-[2rem]`}>
            <CardBody className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex flex-col gap-1">
                  <span className="text-white/80 font-medium text-[10px] uppercase tracking-wider">{item.title}</span>
                  <span className="text-2xl font-bold tracking-tight">{convertValue(item.metric)}</span>
                </div>
                <div className="p-2.5 bg-white/20 rounded-xl backdrop-blur-sm">
                  <item.icon size={20} className="text-white" />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Top Sellers & Best Categories Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-10">
        {/* Top Sellers */}
        <DashboardCard title="Vendedores Top" subtitle="Ranking general">
          <div className="overflow-y-auto">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">#</th>
                  <th className="text-left py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Vendedor</th>
                  <th className="text-center py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Órdenes</th>
                  <th className="text-right py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Ventas</th>
                </tr>
              </thead>
              <tbody>
                {(topSellers || []).slice(0, 10).map((seller, index) => {
                  const RankIcon = rankIcons[index] || null;
                  const rankColor = rankColors[index] || "text-slate-500";
                  return (
                    <tr key={seller.userId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3 w-10">
                        {RankIcon ? <RankIcon size={18} className={rankColor} /> : <span className="text-sm font-bold text-slate-400">{index + 1}</span>}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-800">{seller.username}</td>
                      <td className="py-3 px-3 text-center text-sm text-slate-500">{seller.orderCount}</td>
                      <td className="py-3 px-3 text-right font-bold text-slate-900">{convertValue(seller.totalSales)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {(!topSellers || topSellers.length === 0) && (
            <p className="text-center text-slate-400 text-sm py-10">Sin datos de vendedores</p>
          )}
        </DashboardCard>

        {/* Best Selling Categories */}
        <DashboardCard title="Categorías Más Vendidas" subtitle="Ranking general">
          <div className="flex flex-col lg:flex-row items-center gap-10 h-full">
            {categoryChartData.length > 0 ? (
              <div className="w-full lg:w-1/4 flex justify-center">
                <DonutChart
                  className="h-48 w-48"
                  data={categoryChartData}
                  category="value"
                  index="name"
                  colors={["blue", "violet", "rose", "amber", "emerald", "cyan", "indigo", "pink"]}
                  showAnimation={true}
                  showLabel={false}
                  valueFormatter={dataFormatter}
                />
              </div>
            ) : null}
            <div className="flex-1 w-full overflow-y-auto">
              <table className="w-full">
                <thead className="sticky top-0 bg-white z-10">
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Categoría</th>
                    <th className="text-center py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Ventas</th>
                    <th className="text-right py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(bestSellingCategories || []).slice(0, 8).map((item) => (
                    <tr key={item.categoryName} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                      <td className="py-3 px-3">
                        <div className="text-[13px] font-bold text-slate-800 leading-tight">
                          {item.categoryName}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center text-xs font-medium text-slate-500">{item.orderCount}</td>
                      <td className="py-3 px-3 text-right text-sm font-bold text-slate-900 whitespace-nowrap">{convertValue(item.totalSales)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {(!bestSellingCategories || bestSellingCategories.length === 0) && (
                <p className="text-center text-slate-400 text-sm py-10">Sin datos de categorías</p>
              )}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Available Inventory Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-10">
        {/* Cuentas Completas */}
        <DashboardCard title="Cuentas Completas" subtitle="Inventario activo">
          <div className="overflow-y-auto max-h-72">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Categoría</th>
                  <th className="text-right py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Disponibles</th>
                </tr>
              </thead>
              <tbody>
                {(availableInventory || []).map((item) => (
                  <tr key={item.categoryId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.categoryName}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{item.accountsCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* Perfiles Individuales */}
        <DashboardCard title="Perfiles Individuales" subtitle="Inventario activo">
          <div className="overflow-y-auto max-h-72">
            <table className="w-full">
              <thead className="sticky top-0 bg-white z-10">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Categoría</th>
                  <th className="text-right py-3 px-3 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-400">Disponibles</th>
                </tr>
              </thead>
              <tbody>
                {(availableInventory || []).map((item) => (
                  <tr key={item.categoryId} className="border-b border-slate-100 hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 font-semibold text-slate-800">{item.categoryName}</td>
                    <td className="py-3 px-3 text-right font-bold text-slate-900">{item.profilesCount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </DashboardCard>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 mt-10">
        <DashboardCard title="Tendencia de Ventas (Mes Actual)">
          <AreaChart
            className="h-80"
            data={currentMonthData}
            index="day"
            categories={["Ventas"]}
            colors={["blue"]}
            valueFormatter={dataFormatter}
            showAnimation={true}
            showLegend={false}
            yAxisWidth={100}
          />
        </DashboardCard>

        <DashboardCard title="Comparativa Anual 2025">
          <BarChart
            className="h-80"
            data={annualData}
            index="month"
            categories={["Ventas 2025"]}
            colors={["violet"]}
            valueFormatter={dataFormatter}
            showAnimation={true}
            showLegend={false}
            yAxisWidth={100}
          />
        </DashboardCard>
      </div>
    </PageContainer>
  );
};

export default Dashboard;
