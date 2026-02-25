import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody } from "@heroui/react";
import { Clock } from 'lucide-react';

const DAYS_ES = {
  monday: 'Lunes',
  tuesday: 'Martes',
  wednesday: 'Miércoles',
  thursday: 'Jueves',
  friday: 'Viernes',
  saturday: 'Sábado',
  sunday: 'Domingo'
};

const DEFAULT_HOURS = {
  monday: { open: '09:00', close: '18:00', isOpen: true },
  tuesday: { open: '09:00', close: '18:00', isOpen: true },
  wednesday: { open: '09:00', close: '18:00', isOpen: true },
  thursday: { open: '09:00', close: '18:00', isOpen: true },
  friday: { open: '09:00', close: '18:00', isOpen: true },
  saturday: { open: '09:00', close: '14:00', isOpen: true },
  sunday: { open: '00:00', close: '00:00', isOpen: false }
};

const formatTime = (time) => {
  if (!time) return '--:--';
  const [h, m] = time.split(':');
  const hour = parseInt(h, 10);
  const minute = m || '00';
  if (hour === 0 && minute === '00') return '--:--';
  return `${hour.toString().padStart(2, '0')}:${minute}`;
};

const BusinessHoursSection = () => {
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
  const businessHours = publicSettings?.businessHours || DEFAULT_HOURS;

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-10 w-1.5 bg-amber-500 rounded-full" />
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Horario Comercial</h2>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 md:p-8 backdrop-blur-md shadow-2xl">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-sm font-black text-white/40 uppercase tracking-widest">Estado Actual</p>
            <p className="text-xs font-bold text-white/30">Consulta nuestros horarios de atención personalizada.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {Object.entries(DAYS_ES).map(([key, label]) => {
            const day = businessHours[key] || DEFAULT_HOURS[key];
            const isOpen = day?.isOpen;
            return (
              <div
                key={key}
                className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] transition-colors border border-transparent hover:border-white/5"
              >
                <span className="text-sm font-black text-white/60">{label}</span>
                {isOpen ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-black text-white">
                      {formatTime(day?.open)} - {formatTime(day?.close)}
                    </span>
                  </div>
                ) : (
                  <span className="text-[10px] font-black text-white/20 uppercase tracking-widest italic">Cerrado</span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BusinessHoursSection;
