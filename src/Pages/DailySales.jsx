import { useState, useEffect } from 'react';
import SummaryCards from '../Components/DailySales/SummaryCards';
import '../style/dailySales.css';
import Outlay from '../Components/Outlay';
import useErrorHandler from '../Helpers/useErrorHandler';
import DailyTable from '../Components/DailySales/DailyTable';
import { useDispatch, useSelector } from 'react-redux';
import { getDailySales } from '../features/DailySale/dailySaleSlice';
import { getOutlayForDay } from '../features/outlay/OutlaySlice';
import { DollarSign, Wallet, BarChart3, Calendar } from 'lucide-react';
import { PageContainer, PremiumHeader, PremiumCard } from '../Components/ui/PremiumComponents';
import { DatePicker } from "@heroui/react";
import { today, getLocalTimeZone } from "@internationalized/date";
import formatDateForDB from '../utils/functions/formatDateForDB';

const DailySales = () => {
  const summaryDataInitial = {
    totalVentas: 0,
    totalGastos: 0,
    balance: 0
  };

  const [activeTab, setActiveTab] = useState(0);
  const [dateFilter, setDateFilter] = useState('today'); // Kept for logic internal, but UI will use DatePicker mostly or we can sync them
  const [searchTerm, setSearchTerm] = useState(today(getLocalTimeZone()));
  const [summaryData, setSummaryData] = useState(summaryDataInitial);
  const dispatch = useDispatch();
  const { dailySales } = useSelector((state) => state.dailySales);
  const { outlayForDay } = useSelector((state) => state.outlay);

  const { error, success } = useSelector((state) => state.error);

  const handleErrors = useErrorHandler(error, success);

  useEffect(() => {
    handleErrors();
  }, [error, success]);

  // Convert DatePicker value (CalendarDate) to native Date for existing logic if needed, 
  // OR update actions to handle ISO strings directly from CalendarDate.
  // The existing actions seem to expect ISO string.
  useEffect(() => {
    if (searchTerm) {
      const dateObj = searchTerm.toDate(getLocalTimeZone());
      dispatch(getDailySales(dateObj.toISOString()));
      dispatch(getOutlayForDay(dateObj.toISOString()));
    }
  }, [dispatch, searchTerm]);

  useEffect(() => {
    const ventasArray = Array.isArray(dailySales) ? dailySales : [];
    const gastosArray = Array.isArray(outlayForDay) ? outlayForDay : [];

    const totalVentas = ventasArray.reduce((acc, sale) => acc + (parseFloat(sale.amount) || 0), 0);
    const totalGastos = gastosArray.reduce((acc, outlay) => acc + (parseFloat(outlay.amount) || 0), 0);
    setSummaryData({
      totalVentas,
      totalGastos,
      balance: totalVentas - totalGastos
    });
  }, [dailySales, outlayForDay]);

  const handleDateChange = (date) => {
    setSearchTerm(date);
  };

  return (
    <PageContainer>

      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <PremiumHeader
          title="Ventas Diarias"
          description="MONITOREO DE INGRESOS Y GASTOS"
          icon={BarChart3}
          className="mb-0"
        />
        <div className="w-full md:w-64">
          <DatePicker
            label="Fecha"
            value={searchTerm}
            onChange={handleDateChange}
            variant="bordered"
            classNames={{
              label: "text-slate-500 font-bold uppercase tracking-wider text-[10px]",
              inputWrapper: "border-slate-200 bg-white"
            }}
          />
        </div>
      </div>

      <div className="space-y-6 animate-fade-in">
        <SummaryCards data={summaryData} />

        {/* Tabs & Content */}
        <div className="space-y-6">
          {/* Custom Tabs */}
          <div className="inline-flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab(0)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 0
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <DollarSign size={16} />
              <span>VENTAS</span>
            </button>
            <button
              onClick={() => setActiveTab(1)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all duration-300 ${activeTab === 1
                ? 'bg-white text-slate-900 shadow-sm ring-1 ring-black/5'
                : 'text-slate-500 hover:text-slate-700'
                }`}
            >
              <Wallet size={16} />
              <span>GASTOS</span>
            </button>
          </div>

          <PremiumCard>
            {activeTab === 0 ? (
              <div className="animate-fade-in">
                <DailyTable salesData={dailySales || []} searchTerm={searchTerm ? searchTerm.toDate(getLocalTimeZone()) : new Date()} />
              </div>
            ) : (
              <div className="animate-fade-in">
                <Outlay searchDate={searchTerm ? searchTerm.toDate(getLocalTimeZone()) : new Date()} outlaysData={outlayForDay || []} />
              </div>
            )}
          </PremiumCard>
        </div>
      </div>
    </PageContainer>
  );
};

export default DailySales;