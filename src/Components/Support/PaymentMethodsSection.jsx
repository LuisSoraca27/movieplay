import React from 'react';
import { useSelector } from 'react-redux';
import { Card, CardBody } from "@heroui/react";
import { CreditCard, Copy, Check } from 'lucide-react';
import { useState } from 'react';

import nequiLogo from '../../assets/img/nequi-logo.png';
import daviplataLogo from '../../assets/img/daviplata-logo.png';
import bancolombiaLogo from '../../assets/img/bancolombia-logo.png';
import paypalLogo from '../../assets/img/paypal-logo.png';

// Logos locales para todos los métodos de pago. Si falla la carga, se muestra la letra.
const PAYMENT_CONFIG = [
  { key: 'nequi', label: 'Nequi', field: 'number', logoUrl: nequiLogo },
  { key: 'daviplata', label: 'Daviplata', field: 'number', logoUrl: daviplataLogo },
  { key: 'bancolombia', label: 'Bancolombia', field: 'account', logoUrl: bancolombiaLogo },
  { key: 'paypal', label: 'PayPal', field: 'email', logoUrl: paypalLogo },
];

const PaymentCard = ({ label, value, logoUrl }) => {
  const [copied, setCopied] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const handleCopy = () => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showFallbackLetter = !logoUrl || logoError;

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] hover:bg-white/[0.05] border border-transparent hover:border-white/5 transition-all group">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-white border border-white/10 flex items-center justify-center p-2 shadow-xl shrink-0 overflow-hidden">
          {showFallbackLetter ? (
            <span className="text-xl font-black text-gray-400">{label.charAt(0)}</span>
          ) : (
            <img
              src={logoUrl}
              alt={label}
              className="w-full h-full object-contain filter group-hover:scale-110 transition-transform duration-500"
              onError={() => setLogoError(true)}
            />
          )}
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-white/40 uppercase tracking-widest leading-none mb-1">{label}</p>
          <p className="text-lg font-black text-white tracking-tight truncate">{value || '—'}</p>
        </div>
      </div>

      {value && (
        <button
          type="button"
          onClick={handleCopy}
          className={`
            p-3 rounded-xl transition-all duration-300 backdrop-blur-md
            ${copied
              ? 'bg-green-500 text-white scale-110 shadow-lg shadow-green-500/20'
              : 'bg-white/5 border border-white/10 text-white/40 hover:text-white hover:border-white/20 shadow-2xl'
            }
          `}
          title="Copiar"
        >
          {copied ? <Check size={18} /> : <Copy size={18} />}
        </button>
      )}
    </div>
  );
};

const PaymentMethodsSection = () => {
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);
  const paymentMethods = publicSettings?.paymentMethods || {};

  const enabledMethods = PAYMENT_CONFIG.filter(
    (item) => paymentMethods[item.key]?.enabled && (paymentMethods[item.key][item.field] || '').toString().trim()
  ).map((item) => ({
    ...item,
    value: paymentMethods[item.key]?.[item.field] || ''
  }));

  return (
    <div className="w-full space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-10 w-1.5 bg-emerald-500 rounded-full" />
        <h2 className="text-2xl font-black text-white tracking-tight uppercase">Métodos de Pago</h2>
      </div>

      <div className="bg-white/[0.03] border border-white/10 rounded-[2rem] p-6 md:p-8 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CreditCard size={24} />
          </div>
          <div>
            <p className="text-sm font-black text-white/40 uppercase tracking-widest">Pagos Seguros</p>
            <p className="text-xs font-bold text-white/30">Usa el botón de copia para mayor precisión.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {enabledMethods.length > 0 ? (
            enabledMethods.map((item) => (
              <PaymentCard
                key={item.key}
                label={item.label}
                value={item.value}
                logoUrl={item.logoUrl}
              />
            ))
          ) : (
            <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest py-4">No hay métodos de pago configurados.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsSection;
