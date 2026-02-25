import { formatCurrency } from '../../utils/functions/format'
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react'

const SummaryCards = ({ data }) => {
  const { totalVentas, totalGastos, balance } = data

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      {/* Total Ventas */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingUp size={80} className="text-emerald-500" />
        </div>
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Ingresos del día</span>
            <h3 className="text-2xl font-bold text-slate-800">Total Ventas</h3>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <TrendingUp size={24} />
          </div>
        </div>
        <div className="mt-8 z-10">
          <span className="text-4xl font-extrabold text-emerald-600 tracking-tight">
            {formatCurrency(totalVentas)}
          </span>
        </div>
      </div>

      {/* Total Gastos */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <TrendingDown size={80} className="text-rose-500" />
        </div>
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Egresos del día</span>
            <h3 className="text-2xl font-bold text-slate-800">Total Gastos</h3>
          </div>
          <div className="p-3 bg-rose-50 rounded-2xl text-rose-500">
            <TrendingDown size={24} />
          </div>
        </div>
        <div className="mt-8 z-10">
          <span className="text-4xl font-extrabold text-rose-500 tracking-tight">
            {formatCurrency(totalGastos)}
          </span>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 flex flex-col justify-between h-full relative overflow-hidden group hover:shadow-md transition-all duration-300">
        <div className="absolute right-0 top-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
          <DollarSign size={80} className="text-indigo-500" />
        </div>
        <div className="flex justify-between items-start z-10">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] uppercase tracking-wider font-bold text-slate-500">Ganancia neta</span>
            <h3 className="text-2xl font-bold text-slate-800">Balance</h3>
          </div>
          <div className="p-3 bg-indigo-50 rounded-2xl text-indigo-500">
            <DollarSign size={24} />
          </div>
        </div>
        <div className="mt-8 z-10">
          <span className={`text-4xl font-extrabold tracking-tight ${balance >= 0 ? 'text-indigo-600' : 'text-rose-600'}`}>
            {formatCurrency(balance)}
          </span>
        </div>
      </div>
    </div>
  )
}

export default SummaryCards