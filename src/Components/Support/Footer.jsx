import React from 'react';
import { useSelector } from 'react-redux';
import logo from '../../assets/logo.png';

const Footer = () => {
  const publicSettings = useSelector((state) => state.storeSettings.publicSettings);

  const logoUrl = publicSettings?.logo || logo;
  const storeName = publicSettings?.storeName || 'Streaming Solution';
  const footerMessage = publicSettings?.storeDescription || publicSettings?.footerMessage || '';

  return (
    <footer className="py-20 mt-12 border-t border-white/5 bg-transparent flex flex-col items-center justify-center gap-12">
      <div className="flex flex-col items-center gap-6">
        <div className="relative group">
          {/* Subtle logo glow */}
          <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <img
            src={logoUrl}
            alt={`Logo ${storeName}`}
            width={140}
            className="relative opacity-80 group-hover:opacity-100 transition-all duration-700 group-hover:scale-105"
          />
        </div>

        <div className="text-center space-y-3">
          <p className="text-sm font-black text-white/60 uppercase tracking-[0.4em]">
            © {new Date().getFullYear()} <span className="text-white">{storeName}</span>
          </p>
          {footerMessage && (
            <p className="text-[11px] font-medium text-white/20 uppercase tracking-widest max-w-sm mx-auto leading-relaxed">
              {footerMessage}
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center gap-4 mt-4">
        <div className="w-8 h-px bg-white/5" />
        <div className="flex flex-col items-center gap-1 opacity-20 hover:opacity-40 transition-opacity">
          <span className="text-[7px] font-black text-white uppercase tracking-[0.3em]">Powered by</span>
          <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] cursor-default">
            Digital Store Solution
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 