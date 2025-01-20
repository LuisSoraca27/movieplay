import { useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ToggleButton } from "primereact/togglebutton";
import "../style/Dashboard.css";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
  getDashboard,
  getSalesMonthly,
  getSalesAnual,
} from "../features/dashboard/dashboardSlice";

const Dashboard = () => {
  const [isMonthlyView, setIsMonthlyView] = useState(false);

  const dispatch = useDispatch();

  const {
    ventasExternas,
    ventasInternas,
    gastos,
    ventasTotales,
    ventasMonthly,
    VentasAnuales,
  } = useSelector((state) => state.dashboard);

  const convertValue = (value) => {
    const valueRounded = Math.round(value / 1000) * 1000;
    return new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
    }).format(valueRounded);
  };

  // Datos de ejemplo para las tarjetas
  const cardData = [
    {
      title: "Ventas Externas",
      daily: {
        value: convertValue(ventasExternas.daily),
        icon: "pi pi-shopping-cart",
        color: "#3498db",
      },
      monthly: {
        value: convertValue(ventasExternas.monthly),
        icon: "pi pi-shopping-cart",
        color: "#3498db",
      },
    },
    {
      title: "Ventas Internas",
      daily: {
        value: convertValue(ventasInternas.daily),
        icon: "pi pi-home",
        color: "#2ecc71",
      },
      monthly: {
        value: convertValue(ventasInternas.monthly),
        icon: "pi pi-home",
        color: "#2ecc71",
      },
    },
    {
      title: "Gastos",
      daily: {
        value: convertValue(gastos.daily),
        icon: "pi pi-money-bill",
        color: "#e74c3c",
      },
      monthly: {
        value: convertValue(gastos.monthly),
        icon: "pi pi-money-bill",
        color: "#e74c3c",
      },
    },
    {
      title: "Ventas Totales",
      daily: {
        value: convertValue(ventasTotales.daily),
        icon: "pi pi-dollar",
        color: "#f39c12",
      },
      monthly: {
        value: convertValue(ventasTotales.monthly),
        icon: "pi pi-dollar",
        color: "#f39c12",
      },
    },
  ];

  // Datos de ejemplo para el gráfico de tendencias del mes actual
  const currentMonthTrendData = {
    labels: [
      "1",
      "2",
      "3",
      "4",
      "5",
      "6",
      "7",
      "8",
      "9",
      "10",
      "11",
      "12",
      "13",
      "14",
      "15",
      "16",
      "17",
      "18",
      "19",
      "20",
      "21",
      "22",
      "23",
      "24",
      "25",
      "26",
      "27",
      "28",
      "29",
      "30",
      "31",

    ],
    datasets: [
      {
        label: "Ventas Diarias",
        data: ventasMonthly,
        borderColor: "#3498db",
        tension: 0.4,
        fill: false,
      },
      {
        label: "Meta Diaria",
        data: [
          1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000,
          1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000,
          1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000,
          1000000, 1000000, 1000000, 1000000, 1000000, 1000000, 1000000,
          1000000, 1000000, 1000000
        ],
        borderColor: "#e74c3c",
        borderDash: [5, 5],
        tension: 0,
        fill: false,
      },
    ],
  };

  // Datos de ejemplo para las tablas
  const topSellingProducts = [
    { id: 1, name: "Producto A", sales: 1500 },
    { id: 2, name: "Producto B", sales: 1200 },
    { id: 3, name: "Producto C", sales: 1000 },
    { id: 4, name: "Producto D", sales: 800 },
    { id: 5, name: "Producto E", sales: 600 },
  ];

  const topCategories = [
    { id: 1, name: "Electrónicos", sales: 5000 },
    { id: 2, name: "Ropa", sales: 4500 },
    { id: 3, name: "Hogar", sales: 3500 },
    { id: 4, name: "Deportes", sales: 3000 },
    { id: 5, name: "Libros", sales: 2500 },
  ];

  // Datos de ejemplo para la gráfica de ventas anuales
  const annualSalesData = {
    labels: [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ],
    datasets: [
      {
        label: "Ventas 2025",
        data: VentasAnuales,
        backgroundColor: "#9b59b6",
        borderColor: "#8e44ad",
        borderWidth: 2,
        fill: false,
        tension: 0.4,
      },
    ],
  };

  // Opciones para el gráfico de tendencias
  const trendOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Ventas ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Día del Mes",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Tendencia de Ventas del Mes Actual",
      },
    },
  };

  // Opciones para el gráfico de ventas anuales
  const annualSalesOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Ventas ($)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Mes",
        },
      },
    },
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Ventas Anuales",
      },
    },
  };

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getSalesMonthly());
    dispatch(getSalesAnual());
  }, []);

  return (
    <div className="dashboard">
      <h1>Dashboard de Ventas</h1>

      <div className="view-toggle">
        <ToggleButton
          checked={isMonthlyView}
          onChange={(e) => setIsMonthlyView(e.value)}
          onLabel="Vista Mensual"
          offLabel="Vista Diaria"
          onIcon="pi pi-calendar"
          offIcon="pi pi-clock"
          className="mb-3"
        />
      </div>

      <div className="dashboard-cards">
        {cardData.map((card, index) => {
          const data = isMonthlyView ? card.monthly : card.daily;
          return (
            <Card
              key={index}
              className="dashboard-card"
              style={{ backgroundColor: data.color }}
            >
              <div className="card-content">
                <i className={`${data.icon} card-icon`}></i>
                <div className="card-info">
                  <h3>{card.title}</h3>
                  <p className="card-value">{data.value}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <div className="dashboard-charts ">
        <Card className="chart-card">
          <Chart
            type="line"
            data={currentMonthTrendData}
            options={trendOptions}
          />
        </Card>
      </div>

      <div className="dashboard-charts">
        <Card className="chart-card">
          <Chart
            type="line"
            data={annualSalesData}
            options={annualSalesOptions}
          />
        </Card>
      </div>

      {/* <div className="dashboard-tables">
        <Card className="table-card products-table">
          <h3>Productos Más Vendidos</h3>
          <DataTable
            value={topSellingProducts}
            responsiveLayout="scroll"
            className="colored-table"
          >
            <Column field="name" header="Producto" />
            <Column field="sales" header="Ventas" />
          </DataTable>
        </Card>

        <Card className="table-card categories-table">
          <h3>Categorías Más Vendidas</h3>
          <DataTable
            value={topCategories}
            responsiveLayout="scroll"
            className="colored-table"
          >
            <Column field="name" header="Categoría" />
            <Column field="sales" header="Ventas" />
          </DataTable>
        </Card>
      </div> */}
    </div>
  );
};

export default Dashboard;
